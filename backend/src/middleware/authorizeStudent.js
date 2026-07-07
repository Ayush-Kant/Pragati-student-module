export const authorizeStudent = (req, res, next) => {
  const role = req.user?.role || req.headers["x-user-role"] || "student";

  if (role !== "student" && role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Student access required",
    });
  }

  next();
};

export default authorizeStudent;
