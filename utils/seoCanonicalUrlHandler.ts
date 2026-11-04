export const seoCanonicalUrlHandler = (url: string, isFrontPage: boolean, currentDomain: string) => {
  if (!url) {
    return;
  }

  if (isFrontPage) {
    return currentDomain;
  } else {
    return currentDomain + url;
  }
};
