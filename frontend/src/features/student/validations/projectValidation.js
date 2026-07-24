/**
 * Validates a GitHub URL. Must be present and start with 'https://github.com/'.
 */
export const validateGithubUrl = (url) => {
  if (!url || url.trim() === '') {
    return 'GitHub repository URL is required.';
  }
  if (!url.trim().toLowerCase().startsWith('https://github.com/')) {
    return 'GitHub URL must start with "https://github.com/".';
  }
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL.';
  }
};

/**
 * Validates a deployed application URL. Optional, must start with 'https://'.
 */
export const validateDeployedUrl = (url) => {
  if (!url || url.trim() === '') {
    return null; // Optional
  }
  if (!url.trim().toLowerCase().startsWith('https://')) {
    return 'Deployed URL must start with "https://" (secure connection required).';
  }
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL.';
  }
};

/**
 * Validates a PDF file. Optional, must be application/pdf and <= 20MB.
 */
export const validatePdfFile = (file) => {
  if (!file) {
    return null; // Optional
  }
  
  // Verify file type (sometimes file.type is empty on some systems, so check extension too)
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    return 'Only PDF documents are allowed.';
  }

  const maxSizeInBytes = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSizeInBytes) {
    return 'File size exceeds the 20MB limit.';
  }

  return null;
};

/**
 * Validates progress notes. Optional, max 1000 characters.
 */
export const validateProgressNotes = (text) => {
  if (!text) {
    return null;
  }
  if (text.length > 1000) {
    return 'Progress notes cannot exceed 1000 characters.';
  }
  return null;
};

/**
 * Validates the full payload for a milestone submission.
 */
export const validateMilestoneSubmission = (payload) => {
  const errors = {};
  
  const githubError = validateGithubUrl(payload.githubUrl);
  if (githubError) errors.githubUrl = githubError;

  const deployedError = validateDeployedUrl(payload.deployedUrl);
  if (deployedError) errors.deployedUrl = deployedError;

  const notesError = validateProgressNotes(payload.notes);
  if (notesError) errors.notes = notesError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates the full payload for a final project submission.
 */
export const validateFinalProjectSubmission = (payload) => {
  const errors = {};

  const githubError = validateGithubUrl(payload.githubUrl);
  if (githubError) errors.githubUrl = githubError;

  const deployedError = validateDeployedUrl(payload.deployedUrl);
  if (deployedError) errors.deployedUrl = deployedError;

  const pdfError = validatePdfFile(payload.reportFile);
  if (pdfError) errors.reportFile = pdfError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
