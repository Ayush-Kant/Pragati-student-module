// admin.course.validator.js

const validateCourseStatus = (req, res, next) => {
  const allowedStatuses = ['draft', 'published', 'archived'];
  if (!req.body || !req.body.status || !allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({
      error: 'A valid status (draft, published, or archived) is required.'
    });
  }
  next();
};

export { validateCourseStatus };
