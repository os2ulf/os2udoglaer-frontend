import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { baseParse } from '@vue/compiler-dom';
import { compileScript, parse } from '@vue/compiler-sfc';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';

const componentUrl = new URL(
  '../components/blocks/DocumentListBlock.vue',
  import.meta.url,
);
const { descriptor } = parse(readFileSync(componentUrl, 'utf8'));
const compiled = compileScript(descriptor, {
  id: 'document-list-test',
  inlineTemplate: true,
});
const vueUrl = import.meta.resolve('vue');
const stripHtmlUrl = new URL('../utils/stripHtml.ts', import.meta.url).href;
const source = compiled.content
  .replaceAll(/from (["'])vue\1/g, `from '${vueUrl}'`)
  .replaceAll(/from (["'])~\/utils\/stripHtml\1/g, `from '${stripHtmlUrl}'`);
const { default: DocumentList } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);

async function render(lists) {
  const app = createSSRApp({
    render: () =>
      h(
        'main',
        lists.map((items) =>
          h(DocumentList, {
            blockData: { field_material_paragraph: items },
          }),
        ),
      ),
  });
  app.component('NuxtLink', {
    props: ['to'],
    setup:
      (props, { slots }) =>
      () =>
        h('a', { href: props.to }, slots.default?.()),
  });
  app.component('NuxtIcon', { render: () => h('span') });
  return baseParse(await renderToString(app));
}

function elements(node) {
  return [
    ...(node.type === 1 ? [node] : []),
    ...(node.children || []).flatMap(elements),
  ];
}
const attr = (node, name) =>
  node.props.find((prop) => prop.name === name)?.value?.content;
const text = (node) =>
  node.type === 2 ? node.content : (node.children || []).map(text).join('');
const normalizedText = (node) => text(node).replace(/\s+/g, ' ').trim();
const accessibleText = (node) =>
  node.type === 1 && attr(node, 'aria-hidden') === 'true'
    ? ''
    : node.type === 2
      ? node.content
      : (node.children || []).map(accessibleText).join('');
const title = 'Vikingerne sejler ud';
const description = '<p>Beskrivelse af materialet.</p>';

for (const file of [false, true]) {
  for (const custom of [undefined, null, '', '   ', '  Se materialet  ']) {
    test(`${file ? 'file' : 'external link'} with text ${JSON.stringify(custom)}`, async () => {
      const item = {
        field_material_title: title,
        field_material_download_text: custom,
        field_material_description: description,
        field_material_file: file ? 'https://example.com/material.pdf' : null,
        field_material_url: { url: 'https://example.com/course' },
      };
      const nodes = elements(await render([[item]]));
      const link = nodes.find((node) => node.tag === 'a');
      const label = link.children.find(
        (node) => node.type === 1 && attr(node, 'class') === 'sr-only',
      );
      const detail = nodes.find(
        (node) =>
          attr(node, 'class') === 'document-list__card-item-description',
      );
      assert.ok(label, 'the link must contain its spoken text directly');
      const expectedLabel =
        custom?.trim() || `${file ? 'Hent' : 'Gå til'}: ${title}`;
      const expected = `${expectedLabel}. Beskrivelse af materialet.`;
      assert.equal(normalizedText(label), expected);
      assert.equal(accessibleText(link).replace(/\s+/g, ' ').trim(), expected);
      assert.equal(
        label.children.length,
        1,
        'the complete name must be one text node',
      );
      assert.equal(label.children[0].type, 2);
      assert.equal(attr(label, 'aria-hidden'), undefined);
      assert.equal(
        label.props.some((prop) => prop.name === 'hidden'),
        false,
      );
      assert.equal(normalizedText(detail), 'Beskrivelse af materialet.');
      assert.equal(attr(detail, 'aria-hidden'), 'true');
      assert.equal(
        attr(link, 'aria-describedby'),
        undefined,
        'the description must not be announced twice',
      );
      assert.equal(
        attr(link, 'aria-label'),
        undefined,
        'no aria-label may replace the label content',
      );
      assert.equal(attr(link, 'aria-labelledby'), undefined);
      assert.equal(attr(link, 'aria-hidden'), undefined);
      assert.equal(
        attr(link, 'href'),
        file ? item.field_material_file : item.field_material_url.url,
      );
      const visibleLabel = nodes.find(
        (node) => attr(node, 'class') === 'document-list__card-link-text',
      );
      assert.equal(normalizedText(visibleLabel), custom?.trim() || title);
      assert.equal(attr(visibleLabel, 'aria-hidden'), 'true');
      for (const child of link.children.filter(
        (node) => node.type === 1 && node !== label,
      )) {
        assert.equal(
          attr(child, 'aria-hidden'),
          'true',
          'visual duplicates must not be read twice',
        );
      }
    });
  }
}

test('each link in multiple lists includes its description exactly once', async () => {
  const item = {
    field_material_title: title,
    field_material_description: description,
    field_material_url: { url: 'https://example.com' },
  };
  const lists = [
    [item, item],
    [item, item],
  ];
  const nodes = elements(await render(lists));
  const links = nodes.filter((node) => node.tag === 'a');
  assert.equal(links.length, 4);
  for (const link of links) {
    assert.equal(
      accessibleText(link).replace(/\s+/g, ' ').trim(),
      `Gå til: ${title}. Beskrivelse af materialet.`,
    );
    assert.equal(attr(link, 'aria-describedby'), undefined);
  }
});

test('a link without a description has no dangling description reference', async () => {
  const nodes = elements(
    await render([
      [
        {
          field_material_title: title,
          field_material_url: { url: 'https://example.com' },
        },
      ],
    ]),
  );
  const link = nodes.find((node) => node.tag === 'a');
  assert.equal(attr(link, 'aria-describedby'), undefined);
  assert.equal(accessibleText(link).trim(), `Gå til: ${title}.`);
});

test('a material without a destination remains plain text', async () => {
  const root = await render([
    [{ field_material_title: title, field_material_description: description }],
  ]);
  const nodes = elements(root);
  assert.equal(
    nodes.some((node) => node.tag === 'a'),
    false,
  );
  assert.ok(
    nodes.some(
      (node) =>
        attr(node, 'class') === 'document-list__card-link-text' &&
        attr(node, 'aria-hidden') === undefined &&
        normalizedText(node) === title,
    ),
  );
  const visibleDescription = nodes.find(
    (node) => attr(node, 'class') === 'document-list__card-item-description',
  );
  assert.equal(attr(visibleDescription, 'aria-hidden'), undefined);
  assert.equal(normalizedText(visibleDescription), 'Beskrivelse af materialet.');
});
