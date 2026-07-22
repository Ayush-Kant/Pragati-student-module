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

// Helper to read token from header, cookie, or query param.
const extractToken = (req) => {
    const authHeader = req.headers['authorization'] ?? req.headers['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }

    // Support token in cookie named 'token' if cookie parser is used
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }

    // Support ?token=... query param as a fallback
    if (req.query && req.query.token) {
        return String(req.query.token);
    }

    return null;
};

/**
 * authenticateJWT
 * ────────────────
 * Express middleware that validates the Authorization header.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 */
const authenticateJWT = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please provide a valid Bearer token.',
            error: {},
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
                error: {},
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token.',
                error: {},
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid authentication token.',
            error: {},
        });
    }
};

export { authenticateJWT };
export default authenticateJWT;
