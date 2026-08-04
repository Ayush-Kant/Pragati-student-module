/**
 * Formats date strings reliably, with built-in support for relative timestamp strings.
 * @param {string|Date} date - The date value to format.
 * @returns {string} Formatted date string or original relative text.
 */
export const formatDate = (date) => {
  if (!date) return "N/A";

  // Check if string is already a relative time representation
  const relativeKeywords = ["ago", "yesterday", "today", "tomorrow", "just now"];
  const isRelative = relativeKeywords.some((keyword) =>
    String(date).toLowerCase().includes(keyword)
  );

  if (isRelative) return String(date);

  const parsedDate = new Date(date);

  // Fallback if Date parsing yields NaN / Invalid Date
  if (isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Capitalizes and formats status strings (e.g., 'in_progress' -> 'In Progress').
 * @param {string} status - The raw status string.
 * @returns {string} Clean, human-readable status string.
 */
export const formatStatus = (status) => {
  if (!status) return "";

  return String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Returns clean empty-state fallback messages.
 * @param {string} type - The entity type ('sessions', 'tasks', 'notifications', etc.).
 * @returns {string} User-friendly fallback text.
 */
export const getEmptyMessage = (type) => {
  switch (type) {
    case "sessions":
      return "No upcoming sessions";
    case "tasks":
      return "No pending tasks";
    case "notifications":
      return "No new notifications";
    default:
      return "No data available";
  }
};