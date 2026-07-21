// ─────────────────────────────────────────────────────────────────────────────
//  authorizeStudent.js
//  Middleware: ensures the authenticated user has the 'student' role.
//
//  Must be used AFTER authenticateJWT (requires req.user to be set).
//  Returns 403 Forbidden if the role does not match.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * authorizeStudent
 * ─────────────────
 * Guards routes to student-role users only.
 * Requires authenticateJWT to have run first.
 */
const authorizeStudent = (req, res, next) => {
    if (!req.user) {
        // Defensive check — should never happen if authenticateJWT ran
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
