export default function () {
  const useContent = (path: string) => {
    return UseBaseApi(path, {
      params: {
        format: 'json',
        region: 'content',
      },
      keepalive: true,
    });
  };

  return {
    useContent,
  };
}
