import { sanitizeInput } from "../utils/assignmentHelpers.js";

export const validateSubmission = (req, res, next) => {
  const { content, fileUrl, status } = req.body;

  if (!content && !fileUrl) {
    return res.status(400).json({
      success: false,
      message: "submission content or fileUrl is required",
    });
  }

  if (content) {
    req.body.content = sanitizeInput(content);
  }

  if (fileUrl) {
    req.body.fileUrl = sanitizeInput(fileUrl);
  }

  req.body.status = sanitizeInput(status || "Submitted");
  next();
};

export default {
  validateSubmission,
};
