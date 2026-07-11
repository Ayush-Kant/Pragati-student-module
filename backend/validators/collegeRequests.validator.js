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