/**
 * Validates the structure and data payload returned by the dashboard API service.
 * @param {Object} data - The raw API response payload.
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateDashboardData = (data) => {
  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      error: "Invalid payload: Response must be an object.",
    };
  }

  // Ensure essential data structures don't throw unexpected runtime errors
  if (data.upcomingActivities && typeof data.upcomingActivities !== "object") {
    return {
      isValid: false,
      error: "Malformed data: 'upcomingActivities' must be an object or array.",
    };
  }

  if (data.notifications && !Array.isArray(data.notifications)) {
    return {
      isValid: false,
      error: "Malformed data: 'notifications' must be an array.",
    };
  }

  return {
    isValid: true,
    error: null,
  };
};