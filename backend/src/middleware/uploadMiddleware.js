<<<<<<< HEAD
// ─────────────────────────────────────────────────────────────────────────────
//  src/middleware/uploadMiddleware.js
//  Multer middleware for handling PDF report uploads up to 20MB
// ─────────────────────────────────────────────────────────────────────────────

import multer from "multer";
import { FILE_CONSTRAINTS } from "../constants/projectConstants.js";
import { ApiError } from "../utils/projectHelpers.js";

// Memory storage keeps file buffer in RAM for direct S3 upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === FILE_CONSTRAINTS.ALLOWED_MIME ||
    (file.originalname && file.originalname.toLowerCase().endsWith(FILE_CONSTRAINTS.ALLOWED_EXT))
  ) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only PDF files are allowed for report upload"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: FILE_CONSTRAINTS.MAX_REPORT_SIZE,
=======
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "projects");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `project-file-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".zip",
    ".rar",
    ".png",
    ".jpg",
    ".jpeg",
    ".txt",
    ".md",
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not allowed`), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max file size
>>>>>>> b58e0407 (feat: projects backend implementation)
  },
  fileFilter,
});

<<<<<<< HEAD
/**
 * Middleware wrapper for single PDF report upload ("report" field name)
 */
export const uploadReportMiddleware = (req, res, next) => {
  const singleUpload = upload.single("report");

  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new ApiError(400, "File size exceeds maximum allowed limit of 20MB"));
      }
      return next(new ApiError(400, `File upload error: ${err.message}`));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

export default uploadReportMiddleware;
=======
export const uploadProjectFiles = upload.array("files", 10);
export const uploadSingleFile = upload.single("file");
>>>>>>> b58e0407 (feat: projects backend implementation)
