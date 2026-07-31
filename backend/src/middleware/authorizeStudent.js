/**
 * authorizeStudent
 * ─────────────────
 * Guards routes to student-role users only.
 * Requires authenticateJWT to have run first.
 */
export const authorizeStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      error: {},
    });
  }

  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This resource is only available to students.',
      error: {},
    });
  }

  next();
};

export default authorizeStudent;
