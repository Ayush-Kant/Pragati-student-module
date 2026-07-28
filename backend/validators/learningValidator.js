import Joi from "joi";

const validate = (schema) => (req, res, next) => {
    const source = req.method === "GET" ? req.params : req.body;
    const { error, value } = schema.validate(source, { abortEarly: false, stripUnknown: true });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            details: error.details.map((detail) => detail.message),
        });
    }

    if (req.method === "GET") {
        req.params = value;
    } else {
        req.body = value;
    }

    return next();
};

const validateCourseId = validate(Joi.object({
    courseId: Joi.number().integer().positive().required(),
}));

const validateLessonId = validate(Joi.object({
    lessonId: Joi.number().integer().positive().required(),
}));

const validateProgress = validate(Joi.object({
    lessonId: Joi.number().integer().positive().required(),
    courseId: Joi.number().integer().positive().required(),
    progress: Joi.number().min(0).max(100).required(),
}));

const validateNote = validate(Joi.object({
    lessonId: Joi.number().integer().positive().required(),
    note: Joi.string().trim().required(),
}));

export { validateCourseId, validateLessonId, validateProgress, validateNote };
