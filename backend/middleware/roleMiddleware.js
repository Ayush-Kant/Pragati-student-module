const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Gate debug logging behind process.env.DEBUG (B6)
    if (process.env.DEBUG) {
      console.log(`[RoleMiddleware] Checking user role '${req.user?.role}' against allowed roles:`, allowedRoles);
    }

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: insufficient permissions",
        data: null,
      });
    }

    console.log("✅ ACCESS GRANTED");
    next();
  };
};

export default roleMiddleware;