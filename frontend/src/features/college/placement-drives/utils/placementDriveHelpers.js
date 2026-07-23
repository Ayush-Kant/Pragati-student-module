/**
 * Format date into a readable format.
 * Example: 2026-10-15 → Oct 15, 2026
 */
export const formatDate = (date) => {
    if (!date) return "-";
  
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  
  /**
   * Return Tailwind CSS classes based on drive status.
   */
  export const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
  
      case "Open":
        return "bg-green-100 text-green-700";
  
      case "Completed":
        return "bg-gray-100 text-gray-700";
  
      case "Cancelled":
        return "bg-red-100 text-red-700";
  
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  
  /**
   * Sort drives by drive date (earliest first).
   */
  export const sortDrivesByDate = (drives = []) => {
    return [...drives].sort(
      (a, b) => new Date(a.driveDate) - new Date(b.driveDate)
    );
  };
  
  /**
   * Check whether the application deadline has passed.
   */
  export const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
  
    return new Date(deadline) < new Date();
  };