import multer from "multer";

const MAX_SIZE = 5 * 1024 * 1024;

export default multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: 1 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      const error = new Error("Invalid file type. Only PDF resumes are accepted");
      error.statusCode = 415;
      return callback(error);
    }
    return callback(null, true);
  },
});
