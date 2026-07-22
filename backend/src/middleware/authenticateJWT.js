import jwt from 'jsonwebtoken';

const extractToken = (req) => {
    const authHeader = req.get?.('authorization') ?? req.headers?.authorization ?? req.headers?.Authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }

    if (req.cookies?.token) {
        return req.cookies.token;
    }

    const queryToken = req.query?.token;
    if (Array.isArray(queryToken)) {
        return String(queryToken[0]);
    }

    if (typeof queryToken === 'string' && queryToken.trim()) {
        return queryToken;
    }

    return null;
};

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

        req.user = {
            id: decoded.id ?? decoded.uid ?? null,
            userId: decoded.userId ?? decoded.uuid_id ?? decoded.sub ?? null,
            email: decoded.email ?? null,
            role: decoded.role ?? null,
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

        return res.status(401).json({
            success: false,
            message: 'Invalid authentication token.',
            error: {},
        });
    }
};

export { authenticateJWT };
export default authenticateJWT;
