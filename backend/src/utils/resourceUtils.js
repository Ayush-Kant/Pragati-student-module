const crypto = require("crypto");

const getResourceTokenSecret = (secret = null) => {
  return secret || process.env.RESOURCE_TOKEN_SECRET || "pragati-development-secret";
};

const generateSecureResourceToken = (resourceId, expiresAt, secret = null) => {
  const tokenSecret = getResourceTokenSecret(secret);

  return crypto
    .createHmac("sha256", tokenSecret)
    .update(`${resourceId}:${expiresAt}`)
    .digest("hex");
};

const generateSecureResourceUrl = (resourceId, expiresIn = 3600, secret = null) => {
  if (!resourceId) {
    return null;
  }

  const expiresAt = Date.now() + expiresIn * 1000;
  const token = generateSecureResourceToken(resourceId, expiresAt, secret);

  return {
    resourceId,
    token,
    expiresAt,
    secureUrl: `/resources/${resourceId}?token=${token}&expiresAt=${expiresAt}`,
  };
};

const verifySecureResourceToken = (resourceId, token, expiresAt, secret = null) => {
  if (!resourceId || !token || !expiresAt) {
    return false;
  }

  if (Number(expiresAt) <= Date.now()) {
    return false;
  }

  const expectedToken = generateSecureResourceToken(resourceId, expiresAt, secret);

  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(expectedToken, "hex")
    );
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateSecureResourceUrl,
  generateSecureResourceToken,
  verifySecureResourceToken,
};