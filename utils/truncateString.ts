export const truncateString = (
  string: string,
  length: number,
): string | null => {
  if (!string) {
    return null;
  }

  if (string.length <= length) {
    return string;
  }

  let truncated = string.slice(0, length);

  if (/[ ,.]$/.test(truncated)) {
    truncated = truncated.slice(0, -1);
  }

  return truncated + '...';
};
