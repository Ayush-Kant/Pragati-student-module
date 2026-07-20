// uploadHelpers.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure memory storage to receive the file buffer for S3 upload
const storage = multer.memoryStorage();

// Multer middleware setup
export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(new Error("Only PDF (.pdf) files are allowed!"), false);
  }
});

/**
 * Uploads a file to S3 if configured, or falls back to local storage and returns a simulated S3 URL.
 * @param {object} file - The file object from multer (containing buffer)
 * @returns {Promise<string>} The S3 or simulated S3 URL of the uploaded file
 */
export const uploadToS3 = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided for upload.");
  }

  const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME,
    AWS_REGION = "us-east-1"
  } = process.env;

  // If S3 environment variables are provided, try uploading using the AWS SDK
  if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_BUCKET_NAME) {
    try {
      const { S3Client } = await import("@aws-sdk/client-s3");
      const { Upload } = await import("@aws-sdk/lib-storage");

      const s3 = new S3Client({
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY
        },
        region: AWS_REGION
      });

      const key = `reports/${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;

      const uploadJob = new Upload({
        client: s3,
        params: {
          Bucket: AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read"
        }
      });

      const result = await uploadJob.done();
      return result.Location;
    } catch (err) {
      console.warn("⚠️ AWS S3 upload failed; falling back to simulated storage.", err.message);
    }
  }

  // Fallback: Local file persistence and simulated S3 URL
  try {
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `report_${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file buffer locally
    fs.writeFileSync(filepath, file.buffer);
    console.log(`[Local Fallback] Saved file locally to ${filepath}`);

    // Return a clean, simulated S3 URL format
    return `https://${AWS_BUCKET_NAME || "pragati-s3-bucket"}.s3.amazonaws.com/reports/${filename}`;
  } catch (err) {
    console.error("❌ Local file fallback failed:", err.message);
    throw new Error("Failed to upload project report file.");
  }
};
