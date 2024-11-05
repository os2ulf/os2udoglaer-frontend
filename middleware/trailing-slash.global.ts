export default function ({ path, query, hash }) {
  if (path === '/') return;

  // Remove trailing slashes and lowercase the URL
  const nextPath = path.replace(/\/+$/, '').toLowerCase() || '/';
  const nextRoute = { path: nextPath, query, hash };

  console.log('nextPath', nextPath, 'nextRoute', nextRoute);

  if (path !== nextPath) {
    return navigateTo(nextRoute, { redirectCode: 301 });
  }
}
