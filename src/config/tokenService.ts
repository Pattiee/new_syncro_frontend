/**
 * Retrieves a cookie token value by its name from document.cookie storage.
 * @param name - The key name of the cookie to find (e.g., "XSRF-TOKEN").
 * @returns The token string value if found, or undefined if the cookie does not exist.
 */
export const getToken = (name: string): string | undefined => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
};