import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const uploadDir = path.resolve('uploads/assignments');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const allowed = new Set([
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
]);

const uploader = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, allowed.has(file.mimetype)),
}).single('file');

const uploadMiddleware = (req, res, next) => {
  uploader(req, res, (error) => {
    if (error) return next(error);
    if (req.file) {
      const baseUrl = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
      req.body = req.body || {};
      req.body.fileUrl = `${baseUrl}/uploads/assignments/${encodeURIComponent(req.file.filename)}`;
    }
    if (req.body && typeof req.body.fileUrl === 'string') req.body.fileUrl = req.body.fileUrl.trim();
    next();
  });
};

export default uploadMiddleware;
