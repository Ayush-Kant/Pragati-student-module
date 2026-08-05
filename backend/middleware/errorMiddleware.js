const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === "23505") {
    return res.status(400).json({
      success: false, message: "Duplicate entry",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      success: false, message: "Invalid reference",
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false, message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
