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
  const fallback = req.user?.id || req.headers["x-user-id"] || req.query.studentId;
  const normalized = Number(fallback ?? 101);
  return Number.isFinite(normalized) ? normalized : 101;
};

export const resolveAssignmentStudentId = async (user, fallbackStudentId = null, dbClient = null) => {
  if (!user) {
    return fallbackStudentId ?? 101;
  }

  const client = dbClient || (await import("../../config/db.js")).pool;
  const authUserId = user.id ?? user.authUserId ?? user.auth_user_id;

  if (!authUserId) {
    return fallbackStudentId ?? 101;
  }

  const result = await client.query(
    `SELECT id FROM users WHERE auth_user_id = $1 LIMIT 1`,
    [authUserId]
  );

  if (result.rows?.[0]?.id) {
    return result.rows[0].id;
  }

  return fallbackStudentId ?? 101;
};

export const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export default {
  sanitizeInput,
  normalizeStudentId,
  resolveAssignmentStudentId,
  createError,
};
