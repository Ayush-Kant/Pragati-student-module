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
        });
    }

    if (req.user.role !== 'student') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. This resource is only available to students.',
        });
    }

    next();
};

export { authorizeStudent };
export default authorizeStudent;
