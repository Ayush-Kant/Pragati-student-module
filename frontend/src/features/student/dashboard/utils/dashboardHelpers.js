export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


export const formatStatus = (status) => {
  if (!status) return "";

  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


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