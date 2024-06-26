export const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });

    // Push id state to URL params
    const url = new URL(window.location.href);
    url.hash = id;
    history.pushState(null, '', url.toString());
  }
};
