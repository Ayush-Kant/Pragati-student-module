import * as trainingService from "../services/trainingService.js";

export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await trainingService.getCourses();

        return res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

export const getCourseById = async (req, res, next) => {
    try {
        const course = await trainingService.getCourse(req.params.id);

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
    } catch (error) {
        next(error);
    }
};