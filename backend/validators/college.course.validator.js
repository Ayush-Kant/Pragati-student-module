/**
 * Location: backend/validators/college.course.validator.js
 *
 * Validators here are plain Express middleware, matching the style
 * of admin.college.validator.js: (req, res, next) => {...}, called
 * directly in the route chain before the controller.
 */

const COURSE_NAME_REGEX = /^[A-Za-z][A-Za-z0-9&.,'()\- ]{2,149}$/;
const COURSE_CODE_REGEX = /^[A-Z0-9]{3,20}$/;
const MIN_SEMESTER = 1;
const MAX_SEMESTER = 12;
const MIN_CREDITS = 1;
const MAX_CREDITS = 10;

export const validateCourseCode = (code) => COURSE_CODE_REGEX.test(String(code).trim().toUpperCase());

const isValidSemester = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= MIN_SEMESTER && n <= MAX_SEMESTER;
};

const isValidCredits = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= MIN_CREDITS && n <= MAX_CREDITS;
};

/**
 * Full validation for creating a course (all required fields present).
 */
export const validateCourse = (req, res, next) => {
  const { courseName, courseCode, semester, credits, departmentId, description } = req.body || {};

  if (!courseName || typeof courseName !== "string" || courseName.trim() === "") {
    return res.status(400).json({ error: "Course name is required." });
  }
  if (!COURSE_NAME_REGEX.test(courseName.trim())) {
    return res.status(400).json({
      error: "Course name must be 3-150 characters, start with a letter, and contain only letters, numbers, spaces, or & . , ' ( ) -",
    });
  }

  if (!courseCode || typeof courseCode !== "string" || courseCode.trim() === "") {
    return res.status(400).json({ error: "Course code is required." });
  }
  if (!validateCourseCode(courseCode)) {
    return res.status(400).json({ error: "Course code must be 3-20 uppercase alphanumeric characters (e.g. CS201)." });
  }

  if (semester === undefined || semester === null || semester === "") {
    return res.status(400).json({ error: "Semester is required." });
  }
  if (!isValidSemester(semester)) {
    return res.status(400).json({ error: `Semester must be an integer between ${MIN_SEMESTER} and ${MAX_SEMESTER}.` });
  }

  if (credits === undefined || credits === null || credits === "") {
    return res.status(400).json({ error: "Credits is required." });
  }
  if (!isValidCredits(credits)) {
    return res.status(400).json({ error: `Credits must be an integer between ${MIN_CREDITS} and ${MAX_CREDITS}.` });
  }

  if (departmentId === undefined || departmentId === null || departmentId === "") {
    return res.status(400).json({ error: "departmentId is required." });
  }
  if (!Number.isInteger(Number(departmentId)) || Number(departmentId) <= 0) {
    return res.status(400).json({ error: "departmentId must be a positive integer." });
  }

  if (description !== undefined && description !== null && description !== "") {
    if (typeof description !== "string" || description.length > 2000) {
      return res.status(400).json({ error: "Description must not exceed 2000 characters." });
    }
  }

  next();
};

/**
 * Partial validation for updating a course (all fields optional, but
 * whatever is present is fully validated).
 */
export const validateCourseUpdate = (req, res, next) => {
  const { courseName, courseCode, semester, credits, departmentId, description, isActive } = req.body || {};

  if (courseName !== undefined) {
    if (typeof courseName !== "string" || !COURSE_NAME_REGEX.test(courseName.trim())) {
      return res.status(400).json({
        error: "Course name must be 3-150 characters, start with a letter, and contain only letters, numbers, spaces, or & . , ' ( ) -",
      });
    }
  }

  if (courseCode !== undefined) {
    if (typeof courseCode !== "string" || !validateCourseCode(courseCode)) {
      return res.status(400).json({ error: "Course code must be 3-20 uppercase alphanumeric characters (e.g. CS201)." });
    }
  }

  if (semester !== undefined && !isValidSemester(semester)) {
    return res.status(400).json({ error: `Semester must be an integer between ${MIN_SEMESTER} and ${MAX_SEMESTER}.` });
  }

  if (credits !== undefined && !isValidCredits(credits)) {
    return res.status(400).json({ error: `Credits must be an integer between ${MIN_CREDITS} and ${MAX_CREDITS}.` });
  }

  if (departmentId !== undefined) {
    if (!Number.isInteger(Number(departmentId)) || Number(departmentId) <= 0) {
      return res.status(400).json({ error: "departmentId must be a positive integer." });
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

export default { validateCourseCode, validateCourse, validateCourseUpdate };