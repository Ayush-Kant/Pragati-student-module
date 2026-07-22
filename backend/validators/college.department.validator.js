/**
 * Location: backend/validators/college.department.validator.js
 *
 * Validators here are plain Express middleware, matching the style
 * of admin.college.validator.js: (req, res, next) => {...}, called
 * directly in the route chain before the controller.
 */

const NAME_REGEX = /^[A-Za-z][A-Za-z0-9&.,'()\- ]{2,149}$/;
const CODE_REGEX = /^[A-Z0-9]{2,20}$/;

/**
 * Trims string fields on req.body in place. Not a route-ending
 * middleware — just normalizes input before validation runs.
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

/**
 * Ensures the request body exists and is non-empty for POST/PUT.
 */
export const validateRequestBody = (req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body) || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is missing or empty." });
    }
  }
  next();
};

/**
 * Validates department code format only (helper, not a middleware —
 * used internally and exported for reuse, e.g. by the service layer).
 */
export const validateDepartmentCode = (code) => CODE_REGEX.test(String(code).trim().toUpperCase());

/**
 * Full validation for creating a department (all fields required).
 */
export const validateDepartment = (req, res, next) => {
  const { name, code, hod, description } = req.body || {};

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Department name is required." });
  }
  if (!NAME_REGEX.test(name.trim())) {
    return res.status(400).json({
      error: "Department name must be 3-150 characters, start with a letter, and contain only letters, numbers, spaces, or & . , ' ( ) -",
    });
  }

  if (!code || typeof code !== "string" || code.trim() === "") {
    return res.status(400).json({ error: "Department code is required." });
  }
  if (!validateDepartmentCode(code)) {
    return res.status(400).json({ error: "Department code must be 2-20 uppercase alphanumeric characters (e.g. CSE, IT)." });
  }

  if (hod !== undefined && hod !== null && hod !== "") {
    if (typeof hod !== "string" || hod.trim().length < 3 || hod.trim().length > 150) {
      return res.status(400).json({ error: "HOD name must be between 3 and 150 characters." });
    }
  }

  if (description !== undefined && description !== null && description !== "") {
    if (typeof description !== "string" || description.length > 2000) {
      return res.status(400).json({ error: "Description must not exceed 2000 characters." });
    }
  }

  next();
};

/**
 * Partial validation for updating a department (all fields optional,
 * but whatever is present is fully validated).
 */
export const validateDepartmentUpdate = (req, res, next) => {
  const { name, code, hod, description, isActive } = req.body || {};

  if (name !== undefined) {
    if (typeof name !== "string" || !NAME_REGEX.test(name.trim())) {
      return res.status(400).json({
        error: "Department name must be 3-150 characters, start with a letter, and contain only letters, numbers, spaces, or & . , ' ( ) -",
      });
    }
  }

  if (code !== undefined) {
    if (typeof code !== "string" || !validateDepartmentCode(code)) {
      return res.status(400).json({ error: "Department code must be 2-20 uppercase alphanumeric characters (e.g. CSE, IT)." });
    }
  }

  if (hod !== undefined && hod !== null && hod !== "") {
    if (typeof hod !== "string" || hod.trim().length < 3 || hod.trim().length > 150) {
      return res.status(400).json({ error: "HOD name must be between 3 and 150 characters." });
    }
  }

  if (description !== undefined && description !== null && description !== "") {
    if (typeof description !== "string" || description.length > 2000) {
      return res.status(400).json({ error: "Description must not exceed 2000 characters." });
    }
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    return res.status(400).json({ error: "isActive must be a boolean." });
  }

  next();
};

export default {
  sanitizeInput,
  validateRequestBody,
  validateDepartmentCode,
  validateDepartment,
  validateDepartmentUpdate,
};