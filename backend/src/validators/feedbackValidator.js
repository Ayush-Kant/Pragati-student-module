import { sanitizeInput } from "../utils/assignmentHelpers.js";

export const validateFeedback = (req, res, next) => {
  const { remarks, grade } = req.body;

  if (!remarks || !grade) {
    return res.status(400).json({
      success: false,
      message: "remarks and grade are required",
    });
  }

  req.body.remarks = sanitizeInput(remarks);
  req.body.grade = sanitizeInput(grade);
  next();
};

export default {
  validateFeedback,
};
