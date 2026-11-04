export default function () {
  const useContent = (path: string, signal?: AbortSignal) => {
    return UseBaseApi(path, {
      signal,
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
