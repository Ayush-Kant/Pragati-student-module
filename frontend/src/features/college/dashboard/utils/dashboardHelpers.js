export const getStatusClass = (status) => {
  switch (status) {
    case "success":
      return "text-green-600";

    case "warning":
      return "text-yellow-600";

    case "info":
      return "text-blue-600";

    default:
      return "text-gray-600";
  }
};