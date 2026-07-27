// Format date for displaying in the UI.
 
export const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


//   Calculate remaining days until the deadline.
 
export const calculateDaysLeft = (dueDate) => {
  if (!dueDate) return null;

  const today = new Date();
  const deadline = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
};


//   Return Tailwind classes based on assignment status.
 
export const getStatusColor = (status) => {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Submitted: "bg-blue-100 text-blue-700",
    Late: "bg-red-100 text-red-700",
  };

  return statusColors[status] || "bg-gray-100 text-gray-700";
};


//   Sort assignments by due date.
 
export const sortAssignmentsByDeadline = (
  assignments = [],
  deadline = "upcoming"
) => {
  const sortedAssignments = [...assignments].sort((a, b) => {
    const dateA = new Date(a?.dueDate);
    const dateB = new Date(b?.dueDate);

    if (isNaN(dateA) || isNaN(dateB)) return 0;

    switch (deadline) {
      case "latest":
        return dateB - dateA;

      case "overdue":
        return dateA - dateB;

      case "upcoming":
      default:
        return dateA - dateB;
    }
  });

  return sortedAssignments;
};


//   Filter assignments by status.
 
export const filterAssignmentsByStatus = (
  assignments = [],
  status = "All"
) => {
  if (status === "All") return assignments;

  return assignments.filter(
    ({ status: assignmentStatus }) =>
      assignmentStatus.toLowerCase() === status.toLowerCase()
  );
};


//   Filter assignments by subject.
 
export const filterAssignmentsBySubject = (
  assignments = [],
  subject = "All"
) => {
  if (subject === "All") return assignments;

  return assignments.filter(
    ({ subject: assignmentSubject }) =>
      assignmentSubject.toLowerCase() === subject.toLowerCase()
  );
};


//   Search assignments by title or subject.
 
export const searchAssignments = (
  assignments = [],
  searchTerm = ""
) => {
  const keyword = searchTerm.trim().toLowerCase();

  if (!keyword) return assignments;

  return assignments.filter(
    ({ title, subject }) =>
      title.toLowerCase().includes(keyword) ||
      subject.toLowerCase().includes(keyword)
  );
};