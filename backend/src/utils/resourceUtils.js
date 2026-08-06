const crypto = require("crypto");
const { validate: isUUID } = require("uuid");

const getResourceTokenSecret = (secret = null) => {
  const resolvedSecret = secret ?? process.env.RESOURCE_TOKEN_SECRET;

  if (!resolvedSecret) {
    throw new Error("RESOURCE_TOKEN_SECRET is required");
  }

  return resolvedSecret;
};

const isValidResourceId = (resourceId) => {
  return typeof resourceId === "string" && isUUID(resourceId);
};

const generateSecureResourceToken = (resourceId, expiresAt, secret = null) => {
  if (!isValidResourceId(resourceId)) {
    throw new Error("Invalid Resource ID");
  }

  const tokenSecret = getResourceTokenSecret(secret);

  return crypto
    .createHmac("sha256", tokenSecret)
    .update(`${resourceId}:${expiresAt}`)
    .digest("hex");
};

const generateSecureResourceUrl = (resourceId, expiresIn = 3600, secret = null) => {
  if (!isValidResourceId(resourceId)) {
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
  if (!resourceId || !token || !expiresAt || !isValidResourceId(resourceId)) {
    return false;
  }

  if (Number(expiresAt) <= Date.now()) {
    return false;
  }

  try {
    const expectedToken = generateSecureResourceToken(resourceId, expiresAt, secret);

    return crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(expectedToken, "hex")
    );
  } catch {
    return false;
  }
};

module.exports = {
  generateSecureResourceUrl,
  generateSecureResourceToken,
  verifySecureResourceToken,
};