const uploadMiddleware = (req, res, next) => {
    if (req.file && req.file.originalname && (!req.body || !req.body.fileUrl)) {
        req.body = req.body || {};
        req.body.fileUrl = `http://localhost/uploads/${req.file.originalname}`;
    }

    if (req.body && typeof req.body.fileUrl === 'string') {
        req.body.fileUrl = req.body.fileUrl.trim();
    }

    next();
};

export default uploadMiddleware;
