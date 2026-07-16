export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const validationResult = typeof schema === "function" ? schema(req[property]) : schema.validate(req[property]);
    const { error, value } = validationResult;

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    if (property === "query") {
      req.validatedQuery = value;
    } else if (property === "body") {
      req.validatedBody = value;
    } else if (property === "params") {
      req.validatedParams = value;
    }

    next();
  };
};

export default validateRequest;
