import {
  createCourseService,
  getCoursesService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
  createModuleService,
  deleteModuleService,
} from "../services/course.service.js";

export const createCourse = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const { title, description, skillTags, driveId } = req.body;

    const result = await createCourseService({
      mentorId,
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
    console.error("Create Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const { status, driveId } = req.query;

    const courses = await getCoursesService({ mentorId, status, driveId });

    return res.status(200).json(courses);
  } catch (err) {
    console.error("Get Courses Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { courseId } = req.params;

    const course = await getCourseByIdService({ mentorId, courseId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json(course);
  } catch (err) {
    console.error("Get Courses Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { courseId } = req.params;

    const result = await updateCourseService({
      courseId,
      mentorId,
      ...req.body,
    });

    return res.status(result.statusCode).json({
      success: result.success,
      courseId: result.courseId,
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    console.error("Update Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { courseId } = req.params;

    const result = await deleteCourseService({
      courseId,
      mentorId,
    });

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addModule = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { courseId } = req.params;

    const { title, orderIndex } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 3 characters",
      });
    }

    if (orderIndex === undefined || Number(orderIndex) < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid orderIndex is required",
      });
    }

    const result = await createModuleService({
      courseId,
      mentorId,
      title,
      orderIndex,
    });

    return res.status(result.statusCode).json({
      success: result.success,
      moduleId: result.moduleId,
      orderIndex: result.orderIndex,
      message: result.message,
    });
  } catch (error) {
    console.error("Add Module Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { moduleId } = req.params;

    const result = await deleteModuleService({
      moduleId,
      mentorId,
    });

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete Module Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
