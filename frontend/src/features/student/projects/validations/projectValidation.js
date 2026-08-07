import { FILE_UPLOAD_CONSTRAINTS } from '../constants/projectConstants';

/**
 * Validates a GitHub repository URL format
 */
export const isValidGitHubUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/.*)?$/;
  return githubRegex.test(url.trim());
};

/**
 * Validates project submission form inputs
 * @param {Object} payload - { title, notes, githubRepoUrl, files }
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateSubmissionForm = (payload = {}) => {
  const errors = {};

  // Deliverable Title
  if (!payload.title || !payload.title.trim()) {
    errors.title = 'Deliverable title is required.';
  } else if (payload.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long.';
  }

  // Submission Notes / Description
  if (!payload.notes || !payload.notes.trim()) {
    errors.notes = 'Submission notes / summary are required.';
  } else if (payload.notes.trim().length < 15) {
    errors.notes = 'Please provide detailed notes (at least 15 characters).';
  }

  // GitHub Repository URL
  if (!payload.githubRepoUrl || !payload.githubRepoUrl.trim()) {
    errors.githubRepoUrl = 'GitHub repository URL is required.';
  } else if (!isValidGitHubUrl(payload.githubRepoUrl)) {
    errors.githubRepoUrl = 'Must be a valid GitHub URL (e.g. https://github.com/owner/repo).';
  }

  // Files validation
  if (payload.files && Array.isArray(payload.files) && payload.files.length > 0) {
    const fileErrors = [];
    const maxSizeBytes = FILE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB * 1024 * 1024;

    payload.files.forEach((file) => {
      if (file.size > maxSizeBytes) {
        fileErrors.push(`"${file.name}" exceeds the maximum allowed size of ${FILE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB}MB.`);
      }
      
      // Extension check if file name is available
      if (file.name) {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!FILE_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(ext)) {
          fileErrors.push(`"${file.name}" has an unsupported format. Allowed: ${FILE_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')}.`);
        }
      }
    });

    if (fileErrors.length > 0) {
      errors.files = fileErrors.join(' ');
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
