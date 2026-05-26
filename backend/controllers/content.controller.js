import {
  validateReorderLessons,
  validateAddLesson,
  validateUpdateLesson,
  validateAddResource,
  validateCheckAccessParams,
  validateDeleteResourceParams,
} from '../validators/content.validator.js';

import {
  reorderLessonsInModule,
  addLessonToModule,
  updateLessonById,
  checkLessonAccessByUser,
  addResourceRecord,
  deleteResourceById,
} from '../services/content.service.js';

// Keep your Intern 1 handlers above or below these exports if they already exist.
export const reorderLessons = async (req, res) => {
  try {
    const errors = validateReorderLessons(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
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
      message: error.message || 'Internal server error',
    });
  }
};

export const addLesson = async (req, res) => {
  try {
    const errors = validateAddLesson(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
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
      status: req.body.status || 'draft',
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
      message: error.message || 'Internal server error',
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const errors = validateUpdateLesson(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
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
      message: error.message || 'Internal server error',
    });
  }
};

export const checkLessonAccess = async (req, res) => {
  try {
    const errors = validateCheckAccessParams(req.params);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
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
        message: 'Prerequisite not met',
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
      message: error.message || 'Internal server error',
    });
  }
};

export const addResource = async (req, res) => {
  try {
    const errors = validateAddResource(req.body);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
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
      message: error.message || 'Internal server error',
    });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const errors = validateDeleteResourceParams(req.params);
    if (errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
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
      message: error.message || 'Internal server error',
    });
  }
};