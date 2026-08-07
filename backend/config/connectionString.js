export const normalizeDatabaseConnectionString = (value = "") => {
  if (!value) return "";

  const trimmedValue = value.trim();
  const match = trimmedValue.match(/^([a-zA-Z][a-zA-Z0-9+.-]*:\/\/)([^:/@]+)(?::([^@/]+))?@(.+)$/);

  if (!match) {
    return trimmedValue;
  }

  const [, prefix, username, password, rest] = match;
  const encodedPassword = password ? encodeURIComponent(password) : "";

  return `${prefix}${username}${encodedPassword ? `:${encodedPassword}` : ""}@${rest}`;
};
