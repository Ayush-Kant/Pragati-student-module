import {
  validateReorderLessons,
  validateAddLesson,
  validateUpdateLesson,
  validateAddResource,
  validateCheckAccessParams,
  validateDeleteResourceParams,
} from "../validators/content.validator.js";

import {
  reorderLessonsInModule,
  addLessonToModule,
  updateLessonById,
  checkLessonAccessByUser,
  addResourceRecord,
  deleteResourceById,
  createCourseService,
  getCoursesService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
  createModuleService,
  deleteModuleService,
} from "../services/content.service.js";

// Keep your Intern 1 handlers above or below these exports if they already exist.
export const reorderLessons = async (req, res) => {
  try {
    const errors = validateReorderLessons(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const moduleId = Number(req.params.moduleId);
    const mentorId = req.user?.id || req.user?.userId;

    const result = await reorderLessonsInModule({
      mentorId,
      moduleId,
      lessonOrder: req.body.lessonOrder,
    });

    return res.status(200).json({
      success: true,
      updatedCount: result.updatedCount,
    });
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const addLesson = async (req, res) => {
  try {
    const errors = validateAddLesson(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const moduleId = Number(req.params.moduleId);
    const mentorId = req.user?.id || req.user?.userId;

    const result = await addLessonToModule({
      mentorId,
      moduleId,
      title: req.body.title,
      description: req.body.description,
      prerequisites: req.body.prerequisites || [],
      estimatedDuration: req.body.estimatedDuration,
      status: req.body.status || "draft",
    });

    return res.status(201).json({
      success: true,
      lessonId: result.id,
      orderIndex: result.order_index,
      status: result.status,
    });
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const errors = validateUpdateLesson(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const lessonId = Number(req.params.lessonId);
    const mentorId = req.user?.id || req.user?.userId;

    const result = await updateLessonById({
      mentorId,
      lessonId,
      payload: req.body,
    });

    return res.status(200).json({
      success: true,
      lessonId: result.id,
      status: result.status,
    });
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const checkLessonAccess = async (req, res) => {
  try {
    const errors = validateCheckAccessParams(req.params);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const lessonId = Number(req.params.lessonId);
    const userId = req.user?.id || req.user?.userId;

    const result = await checkLessonAccessByUser({
      userId,
      lessonId,
    });

    if (!result.hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Prerequisite not met",
        requiredLessons: result.requiredLessons || [],
      });
    }

    return res.status(200).json({
      success: true,
      hasAccess: result.hasAccess,
      requiredLessons: result.requiredLessons || [],
    });
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const addResource = async (req, res) => {
  try {
    const errors = validateAddResource(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const mentorId = req.user?.id || req.user?.userId;

    const result = await addResourceRecord({
      mentorId,
      lessonId: req.body.lessonId ?? null,
      courseId: req.body.courseId ?? null,
      title: req.body.title,
      fileUrl: req.body.fileUrl,
      type: req.body.type,
    });

    return res.status(201).json({
      success: true,
      resourceId: result.id,
    });
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const errors = validateDeleteResourceParams(req.params);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resourceId = Number(req.params.resourceId);
    const mentorId = req.user?.id || req.user?.userId;

    await deleteResourceById({
      mentorId,
      resourceId,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// ==========================================
// 1. CREATE COURSE
// ==========================================
export const createCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, skillTags, driveId } = req.body;

    const result = await createCourseService({
      userId,
      title,
      description,
      skillTags,
      driveId,
    });

    if (result.status === "FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message: "Drive does not belong to this mentor or is inactive",
      });
    }

    return res.status(201).json({
      success: true,
      courseId: result.courseId,
      firstModuleId: result.firstModuleId,
      status: "draft",
    });
  } catch (error) {
    console.error("Create Course Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// 2. GET ALL COURSES FOR MENTOR
// ==========================================
export const getCourses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, driveId } = req.query;

    const result = await getCoursesService({
      userId,
      userRole: req.user.role,
      status,
      driveId,
    });

    if (result && result.status === "FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json(result || []);
  } catch (err) {
    console.error("Get Courses Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// 3. GET COURSE BY ID (WITH NESTED MODULES)
// ==========================================
export const getCourseById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const result = await getCourseByIdService({ userId, courseId });

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    console.error("Get Course By ID Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// 4. UPDATE COURSE
// ==========================================
export const updateCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const result = await updateCourseService({
      courseId,
      userId,
      ...req.body,
    });

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      courseId: result.courseId,
      status: result.status,
    });
  } catch (error) {
    console.error("Update Course Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// 5. ARCHIVE COURSE (SOFT DELETE)
// ==========================================
export const deleteCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const result = await deleteCourseService({
      courseId,
      userId,
    });

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete Course Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// 6. ADD MODULE TO COURSE
// ==========================================
export const addModule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;
    const { title, orderIndex } = req.body;

    const result = await createModuleService({
      courseId,
      userId,
      title,
      orderIndex,
    });

    if (result.statusCode !== 201) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(201).json({
      success: true,
      moduleId: result.moduleId,
      orderIndex: result.orderIndex,
    });
  } catch (error) {
    console.error("Add Module Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// 7. HARD DELETE MODULE
// ==========================================
export const deleteModule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { moduleId } = req.params;

    const result = await deleteModuleService({
      moduleId,
      userId,
    });

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete Module Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
