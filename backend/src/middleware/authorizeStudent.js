export const authorizeStudent = (req, res, next) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({
      error: "Access forbidden",
    });
  }

  next();
};

export default authorizeStudent;