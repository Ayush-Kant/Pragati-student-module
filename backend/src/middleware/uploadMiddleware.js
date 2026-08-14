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

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar",
  "application/octet-stream",
  "image/png",
  "image/jpeg",
  "text/plain",
  "text/markdown",
  "text/x-markdown",
];

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
  const mimeType = (file.mimetype || "").toLowerCase();

  if (allowedExtensions.includes(ext) && (allowedMimeTypes.includes(mimeType) || mimeType === "")) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} or MIME type ${mimeType} is not allowed`), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max file size
  },
  fileFilter,
});

export const uploadProjectFiles = upload.array("files", 10);
export const uploadSingleFile = upload.single("file");
