import { CGPA_MAX, CGPA_MIN, FILE_SIZE_LIMITS, FILE_TYPES, PROFILE_COMPLETION_WEIGHTS, PROFILE_SECTIONS } from '../constants/studentProfileConstants';

/**
 * Calculates profile completion percentage across all sections.
 * Checks sections: personal, contact, address, academic, skills, documents, social.
 * @param {Object} profile - The student profile object
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProfileCompletion = (profile) => {
  let score = 0;

  const checkPersonal = () => {
    const fields = ['fullName', 'dateOfBirth', 'gender'];
    const filled = fields.filter(field => profile[field] && profile[field].trim() !== '').length;
    return (filled / fields.length) * PROFILE_COMPLETION_WEIGHTS.PERSONAL;
  };

  const checkContact = () => {
    const fields = ['email', 'phone'];
    const filled = fields.filter(field => profile[field] && profile[field].trim() !== '').length;
    return (filled / fields.length) * PROFILE_COMPLETION_WEIGHTS.CONTACT;
  };

  const checkAddress = () => {
    const fields = ['street', 'city', 'state', 'country', 'pincode'];
    const address = profile.address || {};
    const filled = fields.filter(field => address[field] && address[field].trim() !== '').length;
    return (filled / fields.length) * PROFILE_COMPLETION_WEIGHTS.ADDRESS;
  };

  const checkAcademic = () => {
    const fields = ['department', 'course', 'semester', 'cgpa'];
    const filled = fields.filter(field => profile[field] !== undefined && profile[field] !== null && profile[field] !== '').length;
    return (filled / fields.length) * PROFILE_COMPLETION_WEIGHTS.ACADEMIC;
  };

  const checkSkills = () => {
    const hasSkills = profile.skills && profile.skills.length > 0;
    const hasLanguages = profile.languages && profile.languages.length > 0;
    let skillScore = 0;
    if (hasSkills) skillScore += PROFILE_COMPLETION_WEIGHTS.SKILLS * 0.6;
    if (hasLanguages) skillScore += PROFILE_COMPLETION_WEIGHTS.SKILLS * 0.4;
    return skillScore;
  };

  const checkDocuments = () => {
    let docScore = 0;
    const resume = profile.resume || '';
    const resumeValid = typeof resume === 'string' ? resume.trim() !== '' : !!resume;
    if (resumeValid) docScore += PROFILE_COMPLETION_WEIGHTS.DOCUMENTS * 0.5;
    if (profile.documents && profile.documents.length > 0) docScore += PROFILE_COMPLETION_WEIGHTS.DOCUMENTS * 0.5;
    return docScore;
  };

  const checkSocial = () => {
    const fields = ['linkedIn', 'github', 'portfolio'];
    const filled = fields.filter(field => profile[field] && profile[field].trim() !== '').length;
    return (filled / fields.length) * PROFILE_COMPLETION_WEIGHTS.SOCIAL;
  };

  score += checkPersonal();
  score += checkContact();
  score += checkAddress();
  score += checkAcademic();
  score += checkSkills();
  score += checkDocuments();
  score += checkSocial();

  return Math.round(Math.min(score, 100));
};

/**
 * Checks if a completion step is completed based on the profile data.
 * @param {string} stepId - The step identifier (personal, contact, address, academic, skills, documents, social)
 * @param {Object} profile - The student profile object
 * @returns {boolean} True if the step is completed, false otherwise
 */
export const getCompletionStepStatus = (stepId, profile) => {
  switch (stepId) {
    case PROFILE_SECTIONS.PERSONAL: {
      const fields = ['fullName', 'dateOfBirth', 'gender'];
      return fields.every(field => profile[field] && profile[field].trim() !== '');
    }
    case PROFILE_SECTIONS.CONTACT: {
      const fields = ['email', 'phone'];
      return fields.every(field => profile[field] && profile[field].trim() !== '');
    }
    case PROFILE_SECTIONS.ADDRESS: {
      const address = profile.address || {};
      const fields = ['street', 'city', 'state', 'country', 'pincode'];
      return fields.every(field => address[field] && address[field].trim() !== '');
    }
    case PROFILE_SECTIONS.ACADEMIC: {
      const fields = ['department', 'course', 'semester', 'cgpa'];
      return fields.every(field => profile[field] !== undefined && profile[field] !== null && profile[field] !== '');
    }
    case PROFILE_SECTIONS.SKILLS: {
      return profile.skills && profile.skills.length > 0;
    }
    case PROFILE_SECTIONS.DOCUMENTS: {
      const resume = profile.resume || '';
      const resumeValid = typeof resume === 'string' ? resume.trim() !== '' : !!resume;
      return resumeValid || (profile.documents && profile.documents.length > 0);
    }
    case PROFILE_SECTIONS.SOCIAL: {
      const fields = ['linkedIn', 'github', 'portfolio'];
      return fields.some(field => profile[field] && profile[field].trim() !== '');
    }
    default:
      return false;
  }
};

/**
 * Returns an array of missing required fields in the profile.
 * @param {Object} profile - The student profile object
 * @returns {Array<{section: string, field: string, label: string}>} Array of missing field objects
 */
export const getMissingFields = (profile) => {
  const missing = [];

  if (!profile.fullName || profile.fullName.trim() === '') missing.push({ section: PROFILE_SECTIONS.PERSONAL, field: 'fullName', label: 'Full Name' });
  if (!profile.dateOfBirth || profile.dateOfBirth.trim() === '') missing.push({ section: PROFILE_SECTIONS.PERSONAL, field: 'dateOfBirth', label: 'Date of Birth' });
  if (!profile.gender || profile.gender.trim() === '') missing.push({ section: PROFILE_SECTIONS.PERSONAL, field: 'gender', label: 'Gender' });

  if (!profile.email || profile.email.trim() === '') missing.push({ section: PROFILE_SECTIONS.CONTACT, field: 'email', label: 'Email' });
  if (!profile.phone || profile.phone.trim() === '') missing.push({ section: PROFILE_SECTIONS.CONTACT, field: 'phone', label: 'Phone' });

  const address = profile.address || {};
  if (!address.street || address.street.trim() === '') missing.push({ section: PROFILE_SECTIONS.ADDRESS, field: 'street', label: 'Street' });
  if (!address.city || address.city.trim() === '') missing.push({ section: PROFILE_SECTIONS.ADDRESS, field: 'city', label: 'City' });
  if (!address.state || address.state.trim() === '') missing.push({ section: PROFILE_SECTIONS.ADDRESS, field: 'state', label: 'State' });
  if (!address.country || address.country.trim() === '') missing.push({ section: PROFILE_SECTIONS.ADDRESS, field: 'country', label: 'Country' });
  if (!address.pincode || address.pincode.trim() === '') missing.push({ section: PROFILE_SECTIONS.ADDRESS, field: 'pincode', label: 'Pincode' });

  if (!profile.department || profile.department.trim() === '') missing.push({ section: PROFILE_SECTIONS.ACADEMIC, field: 'department', label: 'Department' });
  if (!profile.course || profile.course.trim() === '') missing.push({ section: PROFILE_SECTIONS.ACADEMIC, field: 'course', label: 'Course' });
  if (profile.semester === undefined || profile.semester === null || profile.semester === '') missing.push({ section: PROFILE_SECTIONS.ACADEMIC, field: 'semester', label: 'Semester' });
  if (profile.cgpa === undefined || profile.cgpa === null || profile.cgpa === '') missing.push({ section: PROFILE_SECTIONS.ACADEMIC, field: 'cgpa', label: 'CGPA' });

  if (!profile.skills || profile.skills.length === 0) missing.push({ section: PROFILE_SECTIONS.SKILLS, field: 'skills', label: 'Skills' });
  if (!profile.languages || profile.languages.length === 0) missing.push({ section: PROFILE_SECTIONS.SKILLS, field: 'languages', label: 'Languages' });

  const resume = profile.resume || '';
  const resumeValid = typeof resume === 'string' ? resume.trim() !== '' : !!resume;
  if (!resumeValid) missing.push({ section: PROFILE_SECTIONS.DOCUMENTS, field: 'resume', label: 'Resume' });

  if (!profile.linkedIn || profile.linkedIn.trim() === '') missing.push({ section: PROFILE_SECTIONS.SOCIAL, field: 'linkedIn', label: 'LinkedIn' });
  if (!profile.github || profile.github.trim() === '') missing.push({ section: PROFILE_SECTIONS.SOCIAL, field: 'github', label: 'GitHub' });
  if (!profile.portfolio || profile.portfolio.trim() === '') missing.push({ section: PROFILE_SECTIONS.SOCIAL, field: 'portfolio', label: 'Portfolio' });

  return missing;
};

/**
 * Formats a date string to a readable format.
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Gets initials from a full name.
 * @param {string} name - The full name
 * @returns {string} Initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts.map(part => part.charAt(0).toUpperCase()).join('');
};

/**
 * Truncates text with an ellipsis if it exceeds the maximum length.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum allowed length
 * @returns {string} The truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Formats a phone number by removing the country code and adding a space separator.
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number (e.g., "98765 43210")
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  const withoutCountryCode = digits.length > 10 ? digits.slice(-10) : digits;
  if (withoutCountryCode.length <= 5) return withoutCountryCode;
  return withoutCountryCode.slice(0, 5) + ' ' + withoutCountryCode.slice(5);
};

export const formatContactValue = (type, value) => {
  if (!value) return '';
  if (type === 'email') return value.toLowerCase();
  if (type === 'phone') return formatPhoneNumber(value);
  return value;
};

/**
 * Validates whether a given string is a valid URL.
 * @param {string} url - The URL string to validate
 * @returns {boolean} True if the URL is valid, false otherwise
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Returns an icon name based on the file type.
 * @param {string} fileType - The file type or extension
 * @returns {string} Icon name ("FileText", "Image", or "File")
 */
export const getFileIcon = (fileType) => {
  if (!fileType) return 'File';
  const type = fileType.toLowerCase();
  if (type === 'pdf' || type === 'doc' || type === 'docx') return 'FileText';
  if (type === 'jpg' || type === 'jpeg' || type === 'png') return 'Image';
  return 'File';
};

/**
 * Checks if an email address is valid.
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email is valid, false otherwise
 */
export const isEmailValid = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Returns Tailwind CSS color classes for a given skill level.
 * @param {string} level - The skill level (Beginner, Intermediate, Advanced, Expert)
 * @returns {string} Tailwind color classes (e.g., "bg-blue-100 text-blue-800")
 */
export const getLevelColor = (level) => {
  const colors = {
    Beginner: 'bg-blue-100 text-blue-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-orange-100 text-orange-800',
    Expert: 'bg-red-100 text-red-800'
  };
  return colors[level] || 'bg-gray-100 text-gray-800';
};

/**
 * Formats an address object into a readable string.
 * @param {Object} address - The address object with street, city, state, country, pincode
 * @returns {string} Formatted address string (e.g., "123 Main St, Bangalore, Karnataka, India - 560001")
 */
export const formatAddress = (address) => {
  if (!address || typeof address !== 'object') return '';
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.country) parts.push(address.country);
  if (address.pincode) parts.push(address.pincode);
  if (parts.length === 0) return '';
  const lastPart = parts.pop();
  if (parts.length === 0) return lastPart;
  return parts.join(', ') + ' - ' + lastPart;
};

/**
 * Validates a CGPA value against the allowed range.
 * @param {number|string} cgpa - The CGPA value to validate
 * @returns {boolean} True if the CGPA is within the valid range
 */
export const validateCGPA = (cgpa) => {
  const num = parseFloat(cgpa);
  return !isNaN(num) && num >= CGPA_MIN && num <= CGPA_MAX;
};

/**
 * Formats a file size in bytes to a human-readable string.
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
/**
 * Converts a File object to a data URL string for persistent storage.
 * @param {File} file - The file to convert
 * @returns {Promise<string>} The data URL string
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extracts the file extension from a filename.
 * @param {string} filename - The filename to extract the extension from
 * @returns {string} The file extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Validates a resume file against allowed types and size limits.
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error: string}} Validation result with error message if invalid
 */
export const isResumeValid = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  if (!FILE_TYPES.RESUME.includes(file.type)) return { valid: false, error: 'Only PDF files are allowed' };
  if (file.size > FILE_SIZE_LIMITS.RESUME) return { valid: false, error: `File size exceeds ${formatFileSize(FILE_SIZE_LIMITS.RESUME)}` };
  return { valid: true };
};

/**
 * Validates a document file against allowed types and size limits.
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error: string}} Validation result with error message if invalid
 */
export const isDocumentValid = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  if (!FILE_TYPES.DOCUMENT.includes(file.type)) return { valid: false, error: 'Invalid file type' };
  if (file.size > FILE_SIZE_LIMITS.DOCUMENT) return { valid: false, error: `File size exceeds ${formatFileSize(FILE_SIZE_LIMITS.DOCUMENT)}` };
  return { valid: true };
};