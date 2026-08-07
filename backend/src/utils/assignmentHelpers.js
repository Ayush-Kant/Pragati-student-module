export const sanitizeInput = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
};

export const normalizeRole = (role) => {
  if (!role) return "";
  return String(role).toLowerCase().trim();
};

export const isInstructorOrAdmin = ({ role }) => {
  const normalizedRole = normalizeRole(role);
  return ["admin", "instructor", "college_admin"].includes(normalizedRole);
};

export const isStudentRole = ({ role }) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "student";
};

export const normalizeStudentId = (req) => {
  const fallback = req?.user?.id ?? req?.headers?.["x-user-id"] ?? req?.query?.studentId;
  const studentId = Number(fallback ?? 101);

  return Number.isFinite(studentId) ? studentId : 101;
};

export const resolveAssignmentStudentId = (req) => {
  const studentId = normalizeStudentId(req);
  return Number.isFinite(studentId) ? studentId : null;
};

export const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export default {
  sanitizeInput,
  normalizeRole,
  isInstructorOrAdmin,
  isStudentRole,
  normalizeStudentId,
  resolveAssignmentStudentId,
  createError,
};
