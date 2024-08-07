import useGetCurrentDomain from '~/composables/useGetCurrentDomain';

export const seoCanonicalUrlHandler = (url: string, isFrontPage: boolean) => {
  if (!url) {
    return;
  }

  const currentDomain = useGetCurrentDomain();

  console.log('currentDomain', currentDomain, url);

  if (isFrontPage) {
    return currentDomain;
  } else {
    return currentDomain + url;
  }
};
