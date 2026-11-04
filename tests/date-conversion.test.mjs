import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dateConversion } from '../utils/dateConversion.ts';

test('CMS dates keep their Danish month names and omit leading zeroes', () => {
  const months = [
    'januar', 'februar', 'marts', 'april', 'maj', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'december',
  ];
  for (const [index, name] of months.entries()) {
    assert.equal(dateConversion(`09.${index + 1}.2026`), `9. ${name} 2026`);
  }
  assert.equal(dateConversion('09.02.2026'), '9. februar 2026');
});

test('empty and incomplete CMS dates do not render a NaN date', () => {
  for (const value of ['', '09', '09.', '09.02', '.02.2026', '09..2026']) {
    assert.equal(dateConversion(value), undefined, value);
  }
});
