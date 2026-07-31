const authorizeStudent = (req, res, next) => {
    // Assuming user role is stored in req.user after JWT authentication
    if (req.user && req.user.role === 'student') {
        next(); // User is authorized, proceed to the next middleware
    } else {
        return res.status(403).json({ message: 'Access denied. Students only.' });
    }
};

module.exports = authorizeStudent;