import * as courseService from "../services/courseService.js";

export const getCourseModules = async (req, res, next) => {
    try {
        const modules = await courseService.getModules(req.params.id);

        if (modules === null) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
                error: { id: req.params.id },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course modules retrieved successfully",
            data: modules,
        });
    } catch (error) {
        next(error);
    }
};

export const getModuleDetails = async (req, res, next) => {
    try {
        const module = await courseService.getModule(req.params.id);

        if (!module) {
            return res.status(404).json({
                success: false,
                message: "Module not found",
                error: { id: req.params.id },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Module retrieved successfully",
            data: module,
        });
    } catch (error) {
        next(error);
    }
};