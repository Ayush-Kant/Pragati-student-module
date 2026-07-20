import { resolveStudentUserId } from "./studentReferenceResolver.js";

export const normalizeRole = (role = "") => String(role || "").toLowerCase();

export const isInstructorOrAdmin = (user = {}) => {
  const role = normalizeRole(user?.role);
  return ["admin", "mentor", "teacher", "hod"].includes(role);
};

export const isStudentRole = (user = {}) => normalizeRole(user?.role) === "student";

export const createAssignmentError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const resolveAssignmentStudentId = async (user = {}, providedStudentId = null, dbClient = null) => {
  const candidate = isStudentRole(user)
    ? (user?.studentId ?? user?.id ?? user?.userId ?? null)
    : (providedStudentId ?? user?.studentId ?? user?.id ?? user?.userId ?? null);

  if (candidate === null || candidate === undefined || candidate === "") {
    return null;
  }

  const normalizedCandidate = Number(candidate);
  if (!Number.isInteger(normalizedCandidate) || normalizedCandidate <= 0) {
    return normalizedCandidate;
  }

  if (dbClient && typeof dbClient.query === "function") {
    const resolvedStudentId = await resolveStudentUserId(dbClient, normalizedCandidate);
    return resolvedStudentId ?? normalizedCandidate;
  }

  if (!dbClient) {
    const { pool } = await import("../../config/db.js");
    const resolvedStudentId = await resolveStudentUserId(pool, normalizedCandidate);
    return resolvedStudentId ?? normalizedCandidate;
  }

  return normalizedCandidate;
};

export default {
  normalizeRole,
  isInstructorOrAdmin,
  isStudentRole,
  createAssignmentError,
  resolveAssignmentStudentId,
};
