/* =====================================
      STUDENT NAME & INITIALS
===================================== */

export const getStudentName = (student = {}) => {
  if (student.name) return student.name;
  if (student.first_name || student.last_name) {
    return `${student.first_name || ""} ${student.last_name || ""}`.trim();
  }
  return student.student || "--";
};

export const getInitials = (name = "") => {
  const fullName = typeof name === "object" ? getStudentName(name) : name;
  if (!fullName || fullName === "--") return "ST";

  return fullName
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

export const getTopBorder = (status = "") => {
  const normalizedStatus = status.toString().toUpperCase();

  switch (normalizedStatus) {
    case "ELIGIBLE":
    case "APPROVED":
      return "border-t-4 border-emerald-500";

    case "WAITING":
    case "WAITLISTED":
    case "PENDING":
      return "border-t-4 border-amber-500";

    case "SHORTLISTED":
      return "border-t-4 border-violet-500/80";

    case "NOMINATED":
      return "border-t-4 border-blue-500";

    case "REJECTED":
    case "WITHDRAWN":
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

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "--";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =====================================
      PACKAGE FORMATTER
===================================== */

export const formatPackage = (pkg) => {
  if (pkg === undefined || pkg === null || pkg === "") return "--";
  return `₹${pkg} LPA`;
};

/* =====================================
      SEARCH STUDENTS
===================================== */

export const searchStudents = (students = [], searchQuery = "") => {
  if (!searchQuery.trim()) {
    return students;
  }

  const query = searchQuery.toLowerCase().trim();

  return students.filter((student) => {
    const fullName = getStudentName(student).toLowerCase();
    const studentId = (student.student_id || student.id || "").toString();
    const enrollmentNo = (student.enrollmentNo || "").toLowerCase();

    return (
      fullName.includes(query) ||
      studentId.includes(query) ||
      enrollmentNo.includes(query)
    );
  });
};