export const truncateString = (string: string, length: number) => {
  if (!string) {
    return null;
  }

  if (string.length <= length) {
    return string;
  }

  return `${string.slice(0, length)}...`;
};
