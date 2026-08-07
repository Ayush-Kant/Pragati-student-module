export const validateDeadline = (req, res, next) => {
  const { dueDate, status } = req.body;

  if (!dueDate) {
    return res.status(400).json({
      success: false,
      message: "dueDate is required",
    });
  }

  if (status && !["Open", "Closed", "Pending"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "status must be Open, Closed, or Pending",
    });
  }

  next();
};

export default {
  validateDeadline,
};
