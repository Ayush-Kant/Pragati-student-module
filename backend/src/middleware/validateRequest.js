export const validateRequest = (validator) => (req, res, next) => {
  try {
    validator(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default validateRequest;
