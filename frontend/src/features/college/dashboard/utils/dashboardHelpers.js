export const getStatusClass = (status) => {
  switch (status) {
    case "success":
      return "success";

    case "warning":
      return "warning";

    case "info":
      return "info";

    default:
      return "";
  }
};