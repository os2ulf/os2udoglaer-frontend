export const stripHtmlFromString = (html: string) => {
  if (!html) {
    return null;
  }

  // Remove HTML tags
  const strippedHtml = html.replace(/<[^>]+>/g, '');

  // Remove common HTML entities
  const withoutEntities = strippedHtml.replace(
    /&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g,
    ' ',
  );

  return withoutEntities;
};
