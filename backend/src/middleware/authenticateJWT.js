// ─────────────────────────────────────────────────────────────────────────────
//  authenticateJWT.js
//  Middleware: verifies the JWT Bearer token on every protected route.
//
//  On success: attaches req.user = { userId, email, role } and calls next().
//  On failure: returns 401 Unauthorized.
//
//  JWT payload shape (set by auth.controller.js):
//    { userId: string (uuid_id), email: string, role: string }
// ─────────────────────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';

/**
 * authenticateJWT
 * ────────────────
 * Express middleware that validates the Authorization header.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 */
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'] ?? req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please provide a valid Bearer token.',
        });
    }

    const token = authHeader.slice(7).trim(); // strip "Bearer "

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token is missing.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded payload to the request for downstream handlers
        req.user = {
            userId: decoded.userId ?? decoded.uuid_id ?? decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please log in again.',
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token.',
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid authentication token.',
        });
    }
};

export { authenticateJWT };
export default authenticateJWT;
