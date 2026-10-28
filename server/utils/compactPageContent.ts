import { stripHtmlFromString } from '../../utils/stripHtml.ts';
import { truncateString } from '../../utils/truncateString.ts';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function pick(value: Record<string, unknown>, keys: string[]) {
  return Object.fromEntries(
    keys
      .filter((key) => Object.hasOwn(value, key))
      .map((key) => [key, value[key]]),
  );
}

function compactCardImage(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.sources)) return value;
  const seenMedia = new Set<string>();
  const sources = value.sources.flatMap((source) => {
    if (!isRecord(source)) return [source];
    // BaseImage renders media/srcset without type. The first usable source for
    // a media query wins; later entries for that same query are never selected.
    if (
      typeof source.media === 'string' &&
      typeof source.srcset === 'string' &&
      source.srcset.trim()
    ) {
      if (seenMedia.has(source.media)) return [];
      seenMedia.add(source.media);
    }
    return [pick(source, ['media', 'srcset'])];
  });
  return {
    ...pick(value, ['width', 'height']),
    sources,
    img_element: isRecord(value.img_element)
      ? pick(value.img_element, ['uri', 'alt', 'title'])
      : value.img_element,
  };
}

function compactSearchCard(value: unknown) {
  if (!isRecord(value)) return value;
  // Only BaseCard consumes these results. Map markers are fetched separately.
  const card = pick(value, [
    'id',
    'bundle',
    'bundle_label',
    'label',
    'link',
    'body',
    'has_body',
    'card_body_text',
    'field_image',
    'provider',
    'corporation',
    'field_audience',
    'field_areas_of_interest',
    'field_industry',
    'field_educators_target_group',
    'field_curriculum_themes',
    'field_target_group',
    'field_trgt_grp_daycare',
    'field_trgt_grp_primary_school',
    'field_primary_school_subject',
    'field_trgt_grp_youth_education',
    'field_youth_education_subject',
    'sales_banner',
    'field_is_free',
    'field_banner',
    'field_theme',
    'field_focus',
  ]);
  // BaseCard selects one audience/subject pair for each content type. The other
  // groups (usually empty arrays) do not contribute to that card's display.
  const audienceFields = [
    'field_audience',
    'field_areas_of_interest',
    'field_educators_target_group',
    'field_curriculum_themes',
    'field_trgt_grp_daycare',
    'field_trgt_grp_primary_school',
    'field_primary_school_subject',
    'field_trgt_grp_youth_education',
    'field_youth_education_subject',
  ];
  let displayedFields: string[] = [];
  if (value.bundle === 'news') displayedFields = ['field_audience'];
  else if (
    value.bundle === 'internship' ||
    value.bundle === 'junior_apprenticeship'
  )
    displayedFields = ['field_areas_of_interest'];
  else if (value.bundle === 'course_educators')
    displayedFields = [
      'field_educators_target_group',
      'field_curriculum_themes',
    ];
  else if (value.bundle === 'course' || value.bundle === 'exercise') {
    if (value.field_target_group === 'Dagtilbud')
      displayedFields = ['field_trgt_grp_daycare', 'field_curriculum_themes'];
    else if (value.field_target_group === 'Grundskole')
      displayedFields = [
        'field_trgt_grp_primary_school',
        'field_primary_school_subject',
      ];
    else if (value.field_target_group === 'Ungdomsuddannelse')
      displayedFields = [
        'field_trgt_grp_youth_education',
        'field_youth_education_subject',
      ];
  }
  for (const field of audienceFields) {
    if (!displayedFields.includes(field)) delete card[field];
  }
  if (typeof card.body === 'string') {
    card.has_body = Boolean(card.body);
    card.card_body_text =
      truncateString(stripHtmlFromString(card.body) || '', 200) || '';
    delete card.body;
  }
  for (const key of ['provider', 'corporation']) {
    if (isRecord(card[key]))
      card[key] = pick(card[key], ['id', 'field_name', 'link']);
  }
  if (card.field_image) card.field_image = compactCardImage(card.field_image);
  return card;
}

// Compact only initial search-card data embedded in content pages. Filter
// metadata, ordinary article bodies, provider pages and map responses stay intact.
export function compactPageContent(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(compactPageContent);
  if (!isRecord(value)) return value;
  if (value.bundle === 'content_search' && Array.isArray(value.results)) {
    return { ...value, results: value.results.map(compactSearchCard) };
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      compactPageContent(child),
    ]),
  );
}
