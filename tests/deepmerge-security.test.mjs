import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';

// Exercise the exact override loaded by the Rollup consumer, including npm links.
const require = createRequire(
  import.meta.resolve('@rollup/plugin-node-resolve'),
);
const merge = require('deepmerge');

test('JSON merges cannot inject inherited flags through null or primitive placeholders', () => {
  for (const session of [null, undefined, 0, false, '']) {
    const result = merge(
      { session },
      JSON.parse('{"session":{"__proto__":{"admin":true},"name":"safe"}}'),
    );
    assert.equal(result.session.admin, undefined);
    assert.equal(result.session.name, 'safe');
    assert.equal(Object.getPrototypeOf(result.session), Object.prototype);
  }
});

test('null-prototype targets and target-owned prototype keys cannot poison the result', () => {
  const payload = JSON.parse('{"__proto__":{"admin":true},"safe":1}');
  for (const target of [Object.create(null), payload]) {
    const result = merge(target, payload);
    assert.equal(result.admin, undefined);
    assert.equal(Object.getPrototypeOf(result), Object.prototype);
    assert.equal(Object.hasOwn(result, '__proto__'), false);
    assert.equal(result.safe, 1);
  }
  assert.equal({}.admin, undefined);
});

test('constructor and prototype keys are rejected at nested levels', () => {
  const result = merge(
    {},
    JSON.parse(
      '{"nested":{"constructor":{"prototype":{"admin":true}},"prototype":{"admin":true},"safe":1}}',
    ),
  );
  assert.deepEqual(result, { nested: { safe: 1 } });
});

test('throwing target property checks fail closed', () => {
  const target = new Proxy(
    {},
    {
      has() {
        throw new Error('blocked');
      },
    },
  );
  assert.deepEqual(merge(target, { injected: true }), {});
});

test('ordinary build options retain recursive cloning, array concatenation and symbols', () => {
  const symbol = Symbol('option');
  const original = {
    nested: { flag: true },
    extensions: ['.js'],
    [symbol]: { enabled: true },
  };
  const result = merge(original, { nested: { other: 1 }, extensions: ['.ts'] });
  assert.deepEqual(result, {
    nested: { flag: true, other: 1 },
    extensions: ['.js', '.ts'],
    [symbol]: { enabled: true },
  });
  assert.notEqual(result.nested, original.nested);
  assert.notEqual(result[symbol], original[symbol]);
  assert.deepEqual(original.extensions, ['.js']);
});

test('custom merges, array replacement, clone:false and all() retain their API', () => {
  const target = { nested: { count: 1 } };
  assert.equal(merge({}, target, { clone: false }).nested, target.nested);
  assert.deepEqual(
    merge({ values: [1] }, { values: [2] }, { arrayMerge: (_a, b) => b }),
    { values: [2] },
  );
  assert.deepEqual(
    merge(
      { nested: { count: 1 } },
      { nested: { count: 2 } },
      {
        customMerge: (key) =>
          key === 'nested'
            ? (a, b) => ({ count: a.count + b.count })
            : undefined,
      },
    ),
    { nested: { count: 3 } },
  );
  assert.deepEqual(merge.all([{ one: 1 }, { two: 2 }]), { one: 1, two: 2 });
  assert.throws(() => merge.all({}), /array/);
});
