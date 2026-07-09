const { validate: isUUID } = require("uuid");

const createResponse = (success, status, message, data = null) => ({
  success,
  status,
  message,
  data,
});

const verifyDashboardAccess = (user) => {
  if (!user) {
    return createResponse(false, 401, "Unauthorized access");
  }

  if (!user.role || user.role.toUpperCase() !== "STUDENT") {
    return createResponse(false, 403, "Forbidden access");
  }

  return createResponse(true, 200, "Access granted");
};

const validateDriveId = (driveId) => {
  if (!driveId || !isUUID(driveId)) {
    return createResponse(false, 400, "Invalid drive ID");
  }

  return createResponse(true, 200, "Valid drive ID");
};

const validateOwnership = (userId, driveOwnerId, driveId) => {
  const driveValidation = validateDriveId(driveId);

  if (!driveValidation.success) {
    return driveValidation;
  }

  if (!userId || !driveOwnerId) {
    return createResponse(false, 400, "Missing user information");
  }

  if (!isUUID(userId) || !isUUID(driveOwnerId)) {
    return createResponse(false, 400, "Invalid UUID");
  }

  if (userId !== driveOwnerId) {
    return createResponse(
      false,
      403,
      "You are not authorized to access this drive"
    );
  }

  return createResponse(true, 200, "Ownership verified");
};

const handleExpiredToken = (error) => {
  if (!error) return null;

  if (error.name === "TokenExpiredError") {
    return createResponse(false, 401, "Token expired");
  }

  if (error.name === "JsonWebTokenError") {
    return createResponse(false, 401, "Invalid token");
  }

  return null;
};

module.exports = {
  verifyDashboardAccess,
  validateOwnership,
  validateDriveId,
  handleExpiredToken,
};