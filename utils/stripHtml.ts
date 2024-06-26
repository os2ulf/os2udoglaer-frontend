export const stripHtmlFromString = (html: string) => {
  if (!html) {
    return null;
  }

  return html.replace(/<[^>]+>/g, '');
};
