export const removeBEdomain = (url: string) => {
  if (!url) {
    return;
  }

  // Find the first single slash after the domain
  const domainEndIndex = url.indexOf('/', url.indexOf('//') + 2);

  // If a single slash is found, return the substring starting from it
  // Otherwise, return undefined
  return domainEndIndex !== -1 ? url.substring(domainEndIndex) : undefined;
};
