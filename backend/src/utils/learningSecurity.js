const { validate: isUUID } = require("uuid");

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

const validateEnrollment = (studentId, courseId) => {
  if (!studentId || !courseId) {
    return createResponse(false, 400, "Missing required fields");
  }

  if (!isUUID(studentId) || !isUUID(courseId)) {
    return createResponse(false, 400, "Invalid UUID");
  }

  return createResponse(true, 200, "Enrollment validated");
};

const verifyCourseAccess = (studentId, courseId) => {
  const validation = validateEnrollment(studentId, courseId);

  if (!validation.success) {
    return validation;
  }

  return createResponse(true, 200, "Course access granted");
};

const validateLessonAccess = (lessonId) => {
  if (!lessonId) {
    return createResponse(false, 400, "Lesson ID is required");
  }

  if (!isUUID(lessonId)) {
    return createResponse(false, 400, "Invalid UUID");
  }

  return createResponse(true, 200, "Lesson access validated");
};

const validateResourceAccess = (resourceId) => {
  if (!resourceId) {
    return createResponse(false, 400, "Resource ID is required");
  }

  if (!isUUID(resourceId)) {
    return createResponse(false, 400, "Invalid UUID");
  }

  return createResponse(true, 200, "Resource access validated");
};

module.exports = {
  verifyCourseAccess,
  validateEnrollment,
  validateLessonAccess,
  validateResourceAccess,
  handleUnauthorizedAccess,
};