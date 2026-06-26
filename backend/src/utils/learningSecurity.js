const isUUID = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
};

const createResponse = (success, status, message, data = null) => ({
  success,
  status,
  message,
  data,
});

const handleUnauthorizedAccess = (
  message = "Unauthorized access",
  status = 401
) => createResponse(false, status, message);

const validateUUIDField = (fieldName, value) => {
  if (!value) {
    return createResponse(false, 400, `${fieldName} is required`);
  }

  if (!isUUID(value)) {
    return createResponse(false, 400, `Invalid ${fieldName}`);
  }

  return createResponse(true, 200, `${fieldName} validated`);
};

const validateEnrollment = (studentId, courseId) => {
  if (!studentId) {
    return createResponse(false, 400, "Student ID is required");
  }

  if (!courseId) {
    return createResponse(false, 400, "Course ID is required");
  }

  const studentValidation = validateUUIDField("Student ID", studentId);
  if (!studentValidation.success) {
    return studentValidation;
  }

  const courseValidation = validateUUIDField("Course ID", courseId);
  if (!courseValidation.success) {
    return courseValidation;
  }

  return createResponse(true, 200, "Enrollment validated");
};

const verifyCourseAccess = (studentId, courseId, accessChecker = null) => {
  const validation = validateEnrollment(studentId, courseId);

  if (!validation.success) {
    return validation;
  }

  if (typeof accessChecker === "function") {
    const accessResult = accessChecker(studentId, courseId);

    if (accessResult === false) {
      return createResponse(false, 403, "Student is not authorized to access this course");
    }

    if (accessResult && accessResult.success === false) {
      return accessResult;
    }
  }

  if (typeof accessChecker === "boolean" && !accessChecker) {
    return createResponse(false, 403, "Student is not authorized to access this course");
  }

  return createResponse(true, 200, "Course access granted");
};

const validateLessonAccess = (lessonId) => {
  return validateUUIDField("Lesson ID", lessonId);
};

const validateResourceAccess = (resourceId) => {
  return validateUUIDField("Resource ID", resourceId);
};

module.exports = {
  verifyCourseAccess,
  validateEnrollment,
  validateLessonAccess,
  validateResourceAccess,
  handleUnauthorizedAccess,
  validateUUIDField,
};