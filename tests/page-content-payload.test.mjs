import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compactPageContent } from '../server/utils/compactPageContent.ts';
import { stripHtmlFromString } from '../utils/stripHtml.ts';
import { truncateString } from '../utils/truncateString.ts';

test('initial search cards keep their displayed text, responsive image choice and filter metadata', () => {
  const body = `<p>${'Danish &amp; text '.repeat(50)}</p>`;
  const card = {
    id: '1',
    bundle: 'course',
    label: 'Course',
    field_target_group: 'Grundskole',
    body,
    field_is_free: true,
    field_primary_school_subject: ['Danish'],
    field_dawa_address: { data: { x: 10, y: 56 } },
    transform_mode: 'search_result',
    provider: {
      id: 'p',
      field_name: 'Provider',
      link: '/provider',
      field_mail: 'unused@example.test',
    },
    field_image: {
      width: 400,
      height: 300,
      attributes: { unused: true },
      img_element: {
        uri: '/fallback.jpg',
        alt: 'Course image',
        title: 'Title',
        unused: true,
      },
      sources: [
        {
          media: '(min-width: 768px)',
          srcset: '/wide.webp 1x',
          type: 'image/webp',
        },
        {
          media: '(max-width: 767px)',
          srcset: '/small.webp 1x',
          type: 'image/webp',
        },
        {
          media: '(min-width: 768px)',
          srcset: '/wide.jpg 1x',
          type: 'image/jpeg',
        },
      ],
    },
  };
  const block = {
    bundle: 'content_search',
    results: [card],
    facets: { subject: ['a', 'b'] },
    pager: { items: 467 },
  };
  const input = { content: { layout: [block] } };
  const snapshot = structuredClone(input);
  const output = compactPageContent(input).content.layout[0];
  assert.deepEqual(input, snapshot);
  assert.equal(
    output.results[0].card_body_text,
    truncateString(stripHtmlFromString(body), 200),
  );
  assert.equal(output.results[0].has_body, true);
  assert.equal(output.results[0].body, undefined);
  assert.equal(output.results[0].field_dawa_address, undefined);
  assert.equal(output.results[0].transform_mode, undefined);
  assert.deepEqual(output.results[0].field_primary_school_subject, ['Danish']);
  assert.deepEqual(output.facets, block.facets);
  assert.deepEqual(output.pager, block.pager);
  assert.equal(output.results[0].provider.field_name, 'Provider');
  assert.equal(output.results[0].provider.field_mail, undefined);
  assert.deepEqual(output.results[0].field_image.sources, [
    { media: '(min-width: 768px)', srcset: '/wide.webp 1x' },
    { media: '(max-width: 767px)', srcset: '/small.webp 1x' },
  ]);
  assert.deepEqual(output.results[0].field_image.img_element, {
    uri: '/fallback.jpg',
    alt: 'Course image',
    title: 'Title',
  });
  assert.deepEqual(compactPageContent({ content: { layout: [output] } }), {
    content: { layout: [output] },
  });
});

test('cards retain the audience fields selected by BaseCard for every supported content type', () => {
  const audiences = {
    field_audience: ['News'],
    field_areas_of_interest: ['Interest'],
    field_educators_target_group: ['Educators'],
    field_curriculum_themes: ['Theme'],
    field_trgt_grp_daycare: ['Daycare'],
    field_trgt_grp_primary_school: ['School'],
    field_primary_school_subject: ['Subject'],
    field_trgt_grp_youth_education: ['Youth'],
    field_youth_education_subject: ['Youth subject'],
  };
  for (const [bundle, group, expected] of [
    ['news', null, ['field_audience']],
    ['internship', null, ['field_areas_of_interest']],
    ['junior_apprenticeship', null, ['field_areas_of_interest']],
    [
      'course_educators',
      null,
      ['field_educators_target_group', 'field_curriculum_themes'],
    ],
    ...['course', 'exercise'].flatMap((bundle) => [
      [
        bundle,
        'Dagtilbud',
        ['field_trgt_grp_daycare', 'field_curriculum_themes'],
      ],
      [
        bundle,
        'Grundskole',
        ['field_trgt_grp_primary_school', 'field_primary_school_subject'],
      ],
      [
        bundle,
        'Ungdomsuddannelse',
        ['field_trgt_grp_youth_education', 'field_youth_education_subject'],
      ],
    ]),
  ]) {
    const input = {
      bundle: 'content_search',
      results: [{ ...audiences, bundle, field_target_group: group }],
    };
    const card = compactPageContent(input).results[0];
    assert.deepEqual(
      new Set(Object.keys(audiences).filter((key) => key in card)),
      new Set(expected),
      `${bundle}: ${group}`,
    );
    for (const key of expected) assert.deepEqual(card[key], audiences[key]);
  }
});

test('ordinary content, provider listings and map result objects are unchanged', () => {
  const input = {
    content: [
      {
        bundle: 'course',
        body: '<p>Full article</p>',
        provider: { field_mail: 'keep@example.test' },
      },
      {
        bundle: 'course_providers',
        results: [
          { body: 'Provider description', field_dawa_address: { lat: 56 } },
        ],
      },
      {
        results: [
          {
            id: 'marker',
            provider: { field_dawa_address: { data: { x: 10, y: 56 } } },
          },
        ],
      },
    ],
  };
  assert.deepEqual(compactPageContent(input), input);
});
