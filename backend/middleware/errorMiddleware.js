const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err?.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "Uploaded file exceeds the 20 MB limit",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file upload",
    });
  }

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

  return res.status(err?.statusCode || err?.status || 500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
};

export default errorMiddleware;
