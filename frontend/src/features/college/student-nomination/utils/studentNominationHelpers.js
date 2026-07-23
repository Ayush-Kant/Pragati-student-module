/* =====================================
      STUDENT INITIALS
===================================== */

export const getInitials = (name = "") => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/* =====================================
      CARD TOP BORDER
===================================== */

export const getTopBorder = (status) => {
  switch (status) {
    case "Eligible":
      return "border-t-4 border-emerald-500";

    case "Waiting":
      return "border-t-4 border-amber-500";

    case "Shortlisted":
      return "border-t-4 border-violet-500/80";

    case "Nominated":
      return "border-t-4 border-blue-500";

    case "Rejected":
      return "border-t-4 border-red-500";

    default:
      return "border-t-4 border-slate-500";
  }
};

/* =====================================
      DATE FORMATTER
===================================== */

export const formatDate = (date) => {
  if (!date) return "--";

  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

/* =====================================
      PACKAGE FORMATTER
===================================== */

export const formatPackage = (pkg) => {
  if (!pkg) return "--";

  return `₹${pkg} LPA`;
};

/* =====================================
      SEARCH STUDENTS
===================================== */

export const searchStudents = (
  students = [],
  searchQuery = ""
) => {
  if (!searchQuery.trim()) {
    return students;
  }

  const query = searchQuery.toLowerCase();

  return students.filter(
    (student) =>
      student.name
        ?.toLowerCase()
        .includes(query) ||
      student.enrollmentNo
        ?.toLowerCase()
        .includes(query)
  );
};

// Student Name 
export const getStudentName = (student) =>
  student.name || student.student || "--";