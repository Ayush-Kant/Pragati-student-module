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
  },
  fileFilter,
});

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
