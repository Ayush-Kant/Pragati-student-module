const authorizeStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    if (req.user.role !== "student") {
        return res.status(403).json({
            success: false,
            message: "Student access only",
        });
    }

    next();
};

export default authorizeStudent;