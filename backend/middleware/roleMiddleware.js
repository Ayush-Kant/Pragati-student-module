const roleMiddleware = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ error: "Access forbidden" });
  next();
};

export default roleMiddleware;
