// validateRequest: Joi-based middleware factory
export const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                errors: error.details.map((d) => ({ path: d.path, message: d.message })),
            });
        }

        if (property === 'query') req.validatedQuery = value;
        else if (property === 'body') req.validatedBody = value;
        else if (property === 'params') req.validatedParams = value;

        next();
    };
};

export default validateRequest;
