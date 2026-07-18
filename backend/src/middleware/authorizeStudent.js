// authorizeStudent: must run after authenticateJWT
const authorizeStudent = (req, res, next) => {
    if (!req.user) {
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

export default authorizeStudent;
