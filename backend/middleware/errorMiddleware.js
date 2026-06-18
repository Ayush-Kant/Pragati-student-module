const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === "23505") {
    return res.status(400).json({
      error: "Duplicate entry",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      error: "Invalid reference",
    });
  }

  return res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;