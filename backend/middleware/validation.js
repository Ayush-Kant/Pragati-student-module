import Joi from "joi";

export const validateGetTrainings = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid("ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"),
    limit: Joi.number().integer().min(1).default(10),
    offset: Joi.number().integer().min(0).default(0),
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  req.validatedQuery = value; // Express 5: req.query is read-only
  next();
};

export const validateAssignMentor = (req, res, next) => {
  const schema = Joi.object({
    mentorId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "mentorId is required",
    });
  }

  next();
};

export const validateIdParam = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};
