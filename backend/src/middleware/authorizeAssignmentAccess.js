import { isInstructorOrAdmin, isStudentRole, normalizeRole } from "../utils/assignmentHelpers.js";

export const authorizeAssignmentAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const role = normalizeRole(req.user.role);
  const isWriteMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (isWriteMethod) {
    if (isInstructorOrAdmin({ role })) {
      return next();
    }
    return res.status(403).json({ success: false, message: "Access forbidden" });
  }

  if (isStudentRole({ role }) || isInstructorOrAdmin({ role })) {
    return next();
  }

  return res.status(403).json({ success: false, message: "Access forbidden" });
};

export default authorizeAssignmentAccess;
