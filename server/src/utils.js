// eslint-disable-next-line import/prefer-default-export
export function getUser(token) {
  return token ? JSON.parse(token) : null;
}
