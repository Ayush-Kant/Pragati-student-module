// submissionValidator.js

/**
 * Validates a GitHub repository URL.
 * @param {string} url 
 * @returns {boolean}
 */
export const validateGithubURL = (url) => {
  if (!url) return false;
  // Match https://github.com/username/repo-name (with optional trailing slash or sub-paths)
  const githubRegex = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/.*)?$/i;
  return githubRegex.test(url.trim());
};

/**
 * Validates a deployed HTTPS URL.
 * @param {string} url 
 * @returns {boolean}
 */
export const validateDeployedURL = (url) => {
  if (!url) return true; // Deployed URL is optional in some workflows
  // Must start with https:// and be a valid URL
  const httpsRegex = /^https:\/\/[A-Za-z0-9_.-]+(\.[A-Za-z0-9_.-]+)+([\/?#].*)?$/i;
  return httpsRegex.test(url.trim());
};

/**
 * Validates file properties for reports (PDF and <= 20MB).
 * @param {object} file 
 * @returns {string|null} Error message or null if valid
 */
export const validateReport = (file) => {
  if (!file) {
    return "Report PDF file is required.";
  }
  
  // Validate MIME type
  if (file.mimetype !== "application/pdf") {
    return "Only PDF files are allowed.";
  }

  // Validate File Size (20 MB = 20 * 1024 * 1024 bytes)
  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    return "File size exceeds the maximum limit of 20 MB.";
  }

  return null;
};

/**
 * Input sanitization middleware to trim all string body fields.
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

/**
 * Middleware to validate final project submissions.
 */
export const validateSubmission = (req, res, next) => {
  const { githubUrl, deployedUrl } = req.body;

  // 1. Required fields check
  if (!githubUrl) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { githubUrl: "GitHub URL is required." }
    });
  }

  // 2. Validate GitHub URL
  if (!validateGithubURL(githubUrl)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { githubUrl: "Invalid GitHub repository URL format. Must start with https://github.com/" }
    });
  }

  // 3. Validate Deployed URL
  if (deployedUrl && !validateDeployedURL(deployedUrl)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { deployedUrl: "Invalid Deployed URL. Must be an HTTPS link starting with https://" }
    });
  }

  // 4. Validate uploaded file (if present in multipart upload)
  if (req.file) {
    const fileError = validateReport(req.file);
    if (fileError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: { report: fileError }
      });
    }
  } else {
    // If it's a final submission, a report is required (unless it's just an update)
    if (req.path.endsWith("/submit") && req.method === "POST") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: { report: "Report PDF file is required." }
      });
    }
  }

  next();
};

export default {
  validateGithubURL,
  validateDeployedURL,
  validateReport,
  sanitizeInput,
  validateSubmission
};
