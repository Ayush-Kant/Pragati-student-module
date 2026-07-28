// ─────────────────────────────────────────────────────────────────────────────
//  src/config/aws.js
//  AWS S3 Service Helpers for Projects Backend Module
// ─────────────────────────────────────────────────────────────────────────────

import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

/**
 * Generates a unique filename for S3 upload
 * @param {string} originalName - Original filename
 * @param {number|string} studentId - Student identifier
 * @param {number|string} projectId - Project identifier
 * @returns {string} Unique object key
 */
export const generateFileName = (originalName = "report.pdf", studentId, projectId) => {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(4).toString("hex");
  const cleanExt = originalName.endsWith(".pdf") ? ".pdf" : ".pdf";
  return `projects/student_${studentId}/project_${projectId}/report_${timestamp}_${randomBytes}${cleanExt}`;
};

/**
 * Uploads a report file buffer to AWS S3 (or generates a mock storage URL in test/dev environment)
 * @param {object} file - Express/Multer file object containing buffer, originalname, mimetype
 * @param {number|string} studentId
 * @param {number|string} projectId
 * @returns {Promise<{ url: string, key: string }>}
 */
export const uploadReport = async (file, studentId, projectId) => {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const key = generateFileName(file.originalname, studentId, projectId);
  const bucket = process.env.AWS_BUCKET_NAME || "pragati-projects-uploads";
  const region = process.env.AWS_REGION || "us-east-1";

  // Check if AWS S3 client can be initialized with credentials
  if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_BUCKET_NAME
  ) {
    try {
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
      const s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || "application/pdf",
      });

      await s3Client.send(command);

      const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
      return { url, key };
    } catch (err) {
      console.warn("⚠️ AWS S3 upload failed, using fallback URL:", err.message);
    }
  }

  // Development / Test / Fallback URL generation
  const fallbackUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  return { url: fallbackUrl, key };
};

/**
 * Deletes a report file from AWS S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>}
 */
export const deleteReport = async (key) => {
  if (!key) return false;

  if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_BUCKET_NAME
  ) {
    try {
      const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
      const s3Client = new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        })
      );
      return true;
    } catch (err) {
      console.warn("⚠️ AWS S3 delete report failed:", err.message);
      return false;
    }
  }
  return true;
};
