import Joi from "joi";

export const validateModule = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().trim().required()),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({ success: false, message: "Invalid module id" });
    }

    next();
};