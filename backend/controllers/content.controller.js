import {
  createCourseService,
  getCoursesService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
  createModuleService,
  deleteModuleService,
} from "../services/content.service.js";

// ==========================================
// 1. CREATE COURSE
// ==========================================
export const createCourse = async (req, res) => {
  try {
    const userId = req.user.uid;
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
    const userId = req.user.uid;
    const { status, driveId } = req.query;

    const result = await getCoursesService({ userId, status, driveId });

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
    const userId = req.user.uid;
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
    const userId = req.user.uid;
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
    const userId = req.user.uid;
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
    const userId = req.user.uid;
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
    const userId = req.user.uid;
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
