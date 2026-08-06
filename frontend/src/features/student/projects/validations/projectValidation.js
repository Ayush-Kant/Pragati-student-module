/**
 * Validation rules for Project Submission Form
 */
import { isValidGitHubUrl } from "../utils/projectHelpers";
import { FILE_UPLOAD_LIMITS } from "../constants/projectConstants";

export const validateSubmissionForm = (formData, files = []) => {
  const errors = {};

  // Submission Title
  if (!formData.title || !formData.title.trim()) {
    errors.title = "Submission title is required.";
  } else if (formData.title.trim().length < 5) {
    errors.title = "Submission title must be at least 5 characters long.";
  }

  // Submission Notes / Description
  if (!formData.notes || !formData.notes.trim()) {
    errors.notes = "Please provide detailed notes or description of your work.";
  } else if (formData.notes.trim().length < 20) {
    errors.notes = "Submission notes must be at least 20 characters long.";
  }

  // GitHub Repository URL
  if (!formData.githubRepoUrl || !formData.githubRepoUrl.trim()) {
    errors.githubRepoUrl = "GitHub Repository URL is required.";
  } else if (!isValidGitHubUrl(formData.githubRepoUrl.trim())) {
    errors.githubRepoUrl = "Please enter a valid GitHub repository URL (e.g. https://github.com/org/repo).";
  }

  // Files validation (optional or restricted size/types)
  if (files && files.length > 0) {
    const invalidFiles = [];
    files.forEach((file) => {
      if (file.size > FILE_UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES) {
        invalidFiles.push(`${file.name} exceeds maximum 25MB limit.`);
      }
    });

    if (invalidFiles.length > 0) {
      errors.files = invalidFiles.join(" ");
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
