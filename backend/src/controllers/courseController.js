import * as courseService from "../services/courseService.js";

export const getCourseModules = async (req, res, next) => {
    try {
        const modules = await courseService.getModules(req.params.id);

        return res.status(200).json({
            success: true,
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
            });
        }

        return res.status(200).json({
            success: true,
            data: module,
        });
    } catch (error) {
        next(error);
    }
};