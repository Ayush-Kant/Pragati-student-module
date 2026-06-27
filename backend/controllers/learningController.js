// learningController.js

import * as service from "../services/learningService.js";

const handleControllerError = (res, err) => {
  let status = err.status || 500;
  if (!err.status) {
    const message = err.message?.toLowerCase() || "";
    const name = err.name || "";

    if (
      name === "ValidationError" ||
      message.includes("validation") ||
      message.includes("invalid")
    ) {
      status = 400;
    } else if (
      name === "UnauthorizedError" ||
      message.includes("unauthorized") ||
      message.includes("auth")
    ) {
      status = 401;
    } else if (
      name === "ForbiddenError" ||
      message.includes("forbidden") ||
      message.includes("denied")
    ) {
      status = 403;
    } else if (name === "NotFoundError" || message.includes("not found")) {
      status = 404;
    }
  }

  return res.status(status).json({
    success: false,
    message: err.message,
  });
};

const getCourses = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student authentication required",
      });
    }

    // Prevent accessing courses of another student
    const targetStudentId =
      req.body.studentId ||
      req.body.userId ||
      req.query.studentId ||
      req.query.userId;
    if (targetStudentId && targetStudentId !== studentId) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You cannot modify or access another student's data",
      });
    }

    // Explicitly enforce student identity in request parameters
    if (req.query) {
      req.query.studentId = studentId;
      req.query.userId = studentId;
    }
    if (req.body) {
      req.body.studentId = studentId;
      req.body.userId = studentId;
    }

    const data = await service.getCourses(studentId, req.query);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const getCourseDetail = async (req, res) => {
  try {
    const course = await service.getCourseDetail(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const getLesson = async (req, res) => {
  try {
    const lesson = await service.getLesson(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student authentication required",
      });
    }

    // Ensure authorization/ownership check: user cannot modify another student's progress
    const targetStudentId =
      req.body.studentId ||
      req.body.userId ||
      req.query.studentId ||
      req.query.userId;
    if (targetStudentId && targetStudentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot modify another student's progress",
      });
    }

    // Explicitly enforce student identity in request parameters to prevent bypass
    if (req.body) {
      req.body.studentId = studentId;
      req.body.userId = studentId;
    }
    if (req.query) {
      req.query.studentId = studentId;
      req.query.userId = studentId;
    }

    const progress = await service.updateProgress(
      req.params.lessonId,
      studentId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const saveNotes = async (req, res) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student authentication required",
      });
    }

    // Ensure authorization/ownership check: user cannot modify another student's notes
    const targetStudentId =
      req.body.studentId ||
      req.body.userId ||
      req.query.studentId ||
      req.query.userId;
    if (targetStudentId && targetStudentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot modify another student's notes",
      });
    }

    // Explicitly enforce student identity in request parameters to prevent bypass
    if (req.body) {
      req.body.studentId = studentId;
      req.body.userId = studentId;
    }
    if (req.query) {
      req.query.studentId = studentId;
      req.query.userId = studentId;
    }

    const note = await service.saveNotes(studentId, req.body);

    return res.status(201).json({
      success: true,
      data: note,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const getResources = async (req, res) => {
  try {
    const resources = await service.getResources(req.params.lessonId);

    return res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const getContinueLearning = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student authentication required",
      });
    }

    // Prevent accessing learning history of another student
    const targetStudentId =
      req.body.studentId ||
      req.body.userId ||
      req.query.studentId ||
      req.query.userId;
    if (targetStudentId && targetStudentId !== studentId) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You cannot modify or access another student's data",
      });
    }

    // Explicitly enforce student identity in request parameters
    if (req.query) {
      req.query.studentId = studentId;
      req.query.userId = studentId;
    }
    if (req.body) {
      req.body.studentId = studentId;
      req.body.userId = studentId;
    }

    const data = await service.getContinueLearning(studentId);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export {
  getCourses,
  getCourseDetail,
  getLesson,
  updateLessonProgress,
  saveNotes,
  getResources,
  getContinueLearning,
};
