const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    console.log("==================================");
    console.log("URL:", req.originalUrl);
    console.log("METHOD:", req.method);
    console.log("Allowed:", roles);
    console.log("User Role:", req.user?.role);

    if (!roles.includes(req.user?.role)) {
      console.log("❌ ACCESS FORBIDDEN");
      return res.status(403).json({
        error: "Access forbidden",
      });
    }

    console.log("✅ ACCESS GRANTED");
    next();
  };
};

export default roleMiddleware;