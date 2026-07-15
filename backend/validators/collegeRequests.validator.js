
export const validateRequestBody = (requiredFields) => (req, res, next) => {
  const missing = requiredFields.filter(field => !req.body[field])
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(', ')}`,
    })
  }
  next()
}

export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim().replace(/[<>]/g, '')
      }
    })
  }
  next()
}

/**
 * Location:
 * backend/validators/collegeRequests.validator.js
 */

export const validateRequestId = (req, res, next) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      error: "Invalid id parameter.",
    });
  }

  next();
};

export const validateSchedule = (req, res, next) => {
  const { scheduled_at } = req.body || {};

  if (scheduled_at !== undefined) {
    const date = new Date(scheduled_at);

    if (isNaN(date.getTime())) {
      return res.status(400).json({
        error: "Invalid scheduled date.",
      });
    }
  }

  next();
};

export default {
  validateRequestId,
  validateSchedule,
};
