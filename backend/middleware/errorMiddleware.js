const errorMiddleware = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err?.code === "23505") {
    return res.status(400).json({
      success: false,
      message: "Duplicate entry",
    });
  }

  if (err?.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "Invalid reference",
    });
  }

  if (err?.status && err.status < 500) {
    return res.status(err.status).json({
      success: false,
      message: err.message || "Request failed",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;
