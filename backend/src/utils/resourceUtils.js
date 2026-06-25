const crypto = require("crypto");

const generateSecureResourceUrl = (
  resourceId,
  expiresIn = 3600
) => {
  if (!resourceId) {
    return null;
  }

  const expiresAt = Date.now() + expiresIn * 1000;

  const token = crypto
    .createHash("sha256")
    .update(`${resourceId}-${expiresAt}`)
    .digest("hex");

  return {
    resourceId,
    token,
    expiresAt,
    secureUrl: `/resources/${resourceId}?token=${token}`,
  };
};

module.exports = {
  generateSecureResourceUrl,
};