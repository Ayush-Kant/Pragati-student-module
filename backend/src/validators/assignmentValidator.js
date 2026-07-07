import { sanitizeInput } from "../utils/assignmentHelpers.js";

export const validateAssignment = (req, res, next) => {
  const { title, subject, dueDate, totalMarks, status } = req.body;

  if (!title || !subject || !dueDate || !totalMarks) {
    return res.status(400).json({
      success: false,
      message: "title, subject, dueDate, and totalMarks are required",
    });
  }

  if (Number(totalMarks) <= 0) {
    return res.status(400).json({
      success: false,
      message: "totalMarks must be greater than 0",
    });
  }

  req.body.title = sanitizeInput(title);
  req.body.subject = sanitizeInput(subject);
  req.body.status = sanitizeInput(status || "Open");
  next();
};

export const validateAssignmentId = (req, res, next) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Valid assignment id is required",
    });
  }

  next();
};

export default {
  validateAssignment,
  validateAssignmentId,
};
