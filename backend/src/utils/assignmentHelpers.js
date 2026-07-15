export const sanitizeInput = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};

export const buildSuccessResponse = (data, message = null) => ({
  success: true,
  ...(message ? { message } : {}),
  data,
});
