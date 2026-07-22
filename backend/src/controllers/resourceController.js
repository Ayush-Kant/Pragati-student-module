import * as resourceService from "../services/resourceService.js";

export const getResources = async (req, res, next) => {
    try {
        const resources = await resourceService.getResources(req.query.lessonId);

        if (resources === null) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
                error: { lessonId: req.query.lessonId },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resources retrieved successfully",
            data: resources,
        });
    } catch (error) {
        next(error);
    }
};

export const getResourcesByCourse = async (req, res, next) => {
    try {
        const resources = await resourceService.getResourcesByCourse(req.params.id);

        if (resources === null) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
                error: { id: req.params.id },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course resources retrieved successfully",
            data: resources,
        });
    } catch (error) {
        next(error);
    }
};

export const downloadResource = async (req, res, next) => {
    try {
        const resource = await resourceService.downloadResource(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
                error: { id: req.params.id },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resource retrieved successfully",
            data: resource,
        });
    } catch (error) {
        next(error);
    }
};