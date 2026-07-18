import jwt from 'jsonwebtoken';

// authenticateJWT
// Verifies Bearer token and attaches normalized `req.user` on success.
const authenticateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Normalize payload into req.user
        req.user = {
            userId: decoded.userId ?? decoded.uuid_id ?? decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "Token expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                error: "Invalid token",
            });
        }

        return res.status(401).json({
            error: "Unauthorized",
        });
    }
};

export default authenticateJWT;
