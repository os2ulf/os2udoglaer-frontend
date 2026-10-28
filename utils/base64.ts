export const encodeBase64 = (value: string): string => {
  if (import.meta.client) {
    return window.btoa(value);
  } else {
    return Buffer.from(value, 'ascii').toString('base64');
  }
};

export const decodeBase64 = (value: string): string => {
  try {
    if (import.meta.client) {
      return window.atob(value);
    } else {
      return Buffer.from(value, 'base64').toString('ascii');
    }
  } catch (error) {
    console.error('Error in decodeBase64:', error);
    throw error;
  }
};
