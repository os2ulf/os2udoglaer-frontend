export const parseJwt = (token: string) => {
  if (process.client) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
};
