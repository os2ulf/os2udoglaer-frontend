export const stripHtmlFromString = (html: string) => {
  if (!html) return null;

  // Replace closing </p> tags with &nbsp;
  const withNbsp = html.replace(/<\/p>/gi, '&nbsp;');

  // Remove all remaining HTML tags (including opening <p>)
  const strippedHtml = withNbsp.replace(/<[^>]+>/g, '');

  // Replace common HTML entities with a space
  return strippedHtml.replace(
    /&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g,
    ' ',
  );
};