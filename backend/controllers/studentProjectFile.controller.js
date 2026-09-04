import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';
import studentProjectModel from '../models/studentProject.model.js';

const uploadRoot = path.join(process.cwd(), 'uploads', 'projects');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const allowedProjectTypes = ['application/pdf', 'image/png', 'image/jpeg'];

export const uploadProjectFile = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, allowedProjectTypes.includes(file.mimetype)),
}).single('file');

// SM-09 final report: optional PDF, maximum 20MB.
export const uploadProjectReport = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype === 'application/pdf'),
}).single('report');

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) { const error = new Error('A PDF, PNG or JPEG file is required'); error.statusCode = 400; throw error; }
    const studentId = await resolveStudentId(req.user);
    const projectId = Number(req.params.projectId);
    const project = await studentProjectModel.getProjectById(studentId, projectId);
    if (!project) { const error = new Error('Project not found'); error.statusCode = 404; throw error; }
    const url = `${req.protocol}://${req.get('host')}/uploads/projects/${req.file.filename}`;
    res.status(201).json({ success: true, data: { id: req.file.filename, name: req.file.originalname, size: req.file.size, type: req.file.mimetype, url, uploadedAt: new Date().toISOString() } });
  } catch (error) {
    if (req.file?.path) fs.rm(req.file.path, { force: true }, () => {});
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const projectId = Number(req.params.projectId);
    const project = await studentProjectModel.getProjectById(studentId, projectId);
    if (!project) { const error = new Error('Project not found'); error.statusCode = 404; throw error; }
    const safeName = path.basename(req.params.fileId);
    await fs.promises.rm(path.join(uploadRoot, safeName), { force: true });
    res.status(200).json({ success: true, data: null });
  } catch (error) { next(error); }
};
