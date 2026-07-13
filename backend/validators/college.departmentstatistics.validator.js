/**
 * Location: backend/validators/college.departmentstatistics.validator.js
 *
 * Validators here are plain Express middleware, matching the style
 * of admin.college.validator.js: (req, res, next) => {...}, called
 * directly in the route chain before the controller.
 */

export const validateStatisticsUpdate = (req, res, next) => {
  const { departmentId, department_id, totalStudents, totalFaculty } = req.body || {};
  const id = departmentId ?? department_id;

  if (id === undefined || id === null || id === "") {
    return res.status(400).json({ error: "departmentId is required." });
  }
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ error: "departmentId must be a positive integer." });
  }

  if (totalStudents !== undefined) {
    if (!Number.isInteger(totalStudents) || totalStudents < 0) {
      return res.status(400).json({ error: "totalStudents must be a non-negative integer." });
    }
  }

  if (totalFaculty !== undefined) {
    if (!Number.isInteger(totalFaculty) || totalFaculty < 0) {
      return res.status(400).json({ error: "totalFaculty must be a non-negative integer." });
    }
  }

  next();
};

export default { validateStatisticsUpdate };