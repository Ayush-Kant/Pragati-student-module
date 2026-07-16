export const authorizeAssignmentAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const role = req.user.role;
  const isWriteMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (isWriteMethod) {
    if (role === "admin" || role === "mentor" || role === "teacher" || role === "hod") {
      return next();
    }
    return res.status(403).json({ error: "Access forbidden" });
  }

  if (role === "student" || role === "admin" || role === "mentor" || role === "teacher" || role === "hod") {
    return next();
  }

  return res.status(403).json({ error: "Access forbidden" });
};

export default authorizeAssignmentAccess;
