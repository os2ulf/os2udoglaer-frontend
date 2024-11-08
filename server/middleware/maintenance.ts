export default defineEventHandler((event) => {
  const { req, res } = event.node;

  if (req.url === '/maintenance') {
    res.statusCode = 500;
  }
});
