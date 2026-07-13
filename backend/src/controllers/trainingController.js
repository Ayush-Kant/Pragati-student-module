import * as trainingService from "../services/trainingService.js";

const getStudentId = (req) => req.user?.userId ?? req.user?.id ?? null;

export const getAllCourses = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const courses = await trainingService.getStudentCourses(studentId);

        return res.status(200).json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

export const getCourseById = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        const course = await trainingService.getStudentCourse(studentId, req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};