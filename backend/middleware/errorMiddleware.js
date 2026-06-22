const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === "23505") {
    return res.status(400).json({
      success: false,
      error: "Duplicate entry",
      message: "Duplicate entry",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      success: false,
      error: "Invalid reference",
      message: "Invalid reference",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
