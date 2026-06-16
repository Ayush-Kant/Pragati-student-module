const { validate: isUUID } = require("uuid");

const verifyDashboardAccess = (user) => {
  if (!user) {
    return {
      success: false,
      status: 401,
      message: "Unauthorized access",
    };
  }

  if (user.role !== "student") {
    return {
      success: false,
      status: 403,
      message: "Forbidden access",
    };
  }

  return {
    success: true,
  };
};

const validateOwnership = (userId, ownerId) => {
  if (!userId || !ownerId) {
    return {
      success: false,
      status: 400,
      message: "Missing user information",
    };
  }

  if (!isUUID(userId) || !isUUID(ownerId)) {
    return {
      success: false,
      status: 400,
      message: "Invalid UUID",
    };
  }

  if (userId !== ownerId) {
    return {
      success: false,
      status: 403,
      message: "You are not authorized to access this resource",
    };
  }

  return {
    success: true,
  };
};

module.exports = {
  verifyDashboardAccess,
  validateOwnership,
};