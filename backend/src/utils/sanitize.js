export const sanitizeInput = (data) => {
  if (!data || typeof data !== "object") return data;

  const sanitized = {};

  for (const key in data) {
    if (typeof data[key] === "string") {
      sanitized[key] = data[key].trim();
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
};

export default sanitizeInput;
