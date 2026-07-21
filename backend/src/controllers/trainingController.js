import * as trainingService from "../services/trainingService.js";

const getStudentId = (req) => req.user?.userId ?? req.user?.id ?? null;

export const getAllCourses = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: {},
            });
        }

        const courses = await trainingService.getStudentCourses(studentId);

        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

export const getCourseById = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: {},
            });
        }

        const course = await trainingService.getStudentCourse(studentId, req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
                error: { id: req.params.id },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course retrieved successfully",
            data: course,
        });
    } catch (error) {
        next(error);
    }
};