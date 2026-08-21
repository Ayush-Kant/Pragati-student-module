import { formatErrorResponse } from "../utils/placementHelpers.js";

export const extractStudentId = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(formatErrorResponse("Unauthorized: User identity not found", "UNAUTHORIZED_ACCESS"));
  }

  const studentId = req.user.id || req.user.studentId || req.user.uid;
  if (!studentId) {
    return res.status(403).json(formatErrorResponse("Forbidden: Student identity missing from token", "UNAUTHORIZED_ACCESS"));
  }

  req.studentId = Number(studentId);
  next();
};

export const enforceStudentIsolation = (req, res, next) => {
  if (req.body && req.body.studentId && Number(req.body.studentId) !== req.studentId) {
    return res.status(403).json(
      formatErrorResponse(
        "Forbidden: Cannot perform actions on behalf of another student",
        "UNAUTHORIZED_ACCESS"
      )
    );
  }
  next();
};

export default {
  extractStudentId,
  enforceStudentIsolation,
};
