export const validate = (validatorFn) => (req, res, next) => {
  const { isValid, errors } = validatorFn(req.body)
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }
  next()
}