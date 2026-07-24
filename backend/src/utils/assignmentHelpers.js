export const sanitizeInput = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
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

export const normalizeRole = (role) => String(role || "").toLowerCase();

export const isStudentRole = ({ role }) => role === "student";

export const isInstructorOrAdmin = ({ role }) => role === "instructor" || role === "admin";

export const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export default {
  sanitizeInput,
  normalizeStudentId,
  resolveAssignmentStudentId,
  normalizeRole,
  isStudentRole,
  isInstructorOrAdmin,
  createError,
};
