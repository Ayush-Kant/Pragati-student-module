import * as resourceService from "../services/resourceService.js";

export const getResources = async (req, res, next) => {
    try {
        const resources = await resourceService.getResources();

        return res.status(200).json({
            success: true,
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
            });
        }

        return res.status(200).json({
            success: true,
            data: resource,
        });
    } catch (error) {
        next(error);
    }
};