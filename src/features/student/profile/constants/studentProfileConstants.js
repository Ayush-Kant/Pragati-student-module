export const PROFILE_SECTIONS = {
  PERSONAL: 'personal',
  CONTACT: 'contact',
  ADDRESS: 'address',
  ACADEMIC: 'academic',
  SKILLS: 'skills',
  DOCUMENTS: 'documents',
  SOCIAL: 'social'
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export const CGPA_MAX = 10;
export const CGPA_MIN = 0;

export const FILE_SIZE_LIMITS = {
  RESUME: 5 * 1024 * 1024,
  DOCUMENT: 10 * 1024 * 1024
};

export const FILE_TYPES = {
  RESUME: ['application/pdf'],
  DOCUMENT: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword']
};

export const PROFILE_COMPLETION_WEIGHTS = {
  PERSONAL: 20,
  CONTACT: 20,
  ACADEMIC: 25,
  SKILLS: 15,
  DOCUMENTS: 10,
  SOCIAL: 10
};

export const RELATIONSHIP_OPTIONS = ['Parent', 'Guardian', 'Spouse', 'Sibling', 'Other'];

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const API_ENDPOINTS = {
  GET_PROFILE: '/student/profile',
  UPDATE_PROFILE: '/student/profile',
  UPLOAD_RESUME: '/student/profile/resume',
  UPLOAD_DOCUMENT: '/student/profile/documents',
  DELETE_DOCUMENT: '/student/profile/documents',
  GET_COMPLETION: '/student/profile/completion',
  GET_SKILLS: '/student/profile/skills',
  UPDATE_SKILLS: '/student/profile/skills'
};

/**
 * Milestone percentages for profile completion tracking.
 * @type {Object}
 * @property {number} BASIC - 25% completion threshold
 * @property {number} MEDIUM - 50% completion threshold
 * @property {number} GOOD - 75% completion threshold
 * @property {number} COMPLETE - 100% completion threshold
 */
export const PROFILE_COMPLETION_MILESTONES = {
  BASIC: 25,
  MEDIUM: 50,
  GOOD: 75,
  COMPLETE: 100
};

/**
 * Common validation error messages used across the application.
 * @type {Object}
 * @property {string} REQUIRED - Required field error message
 * @property {string} EMAIL - Invalid email error message
 * @property {string} PHONE - Invalid phone number error message
 * @property {string} CGPA - CGPA range error message
 * @property {string} URL - Invalid URL error message
 * @property {string} FILE_SIZE - File size exceeded error message
 * @property {string} FILE_TYPE - Unsupported file type error message
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  CGPA: 'CGPA must be between 0 and 10',
  URL: 'Please enter a valid URL',
  FILE_SIZE: 'File size exceeds maximum limit',
  FILE_TYPE: 'File type not supported'
};

/**
 * Document type constants used for categorizing uploaded documents.
 * @type {Object}
 * @property {string} RESUME - Resume document type
 * @property {string} TRANSCRIPT - Transcript document type
 * @property {string} ID_PROOF - ID proof document type
 * @property {string} CERTIFICATE - Certificate document type
 * @property {string} OTHER - Other document type
 */
export const DOCUMENT_TYPES = {
  RESUME: 'resume',
  TRANSCRIPT: 'transcript',
  ID_PROOF: 'id_proof',
  CERTIFICATE: 'certificate',
  OTHER: 'other'
};

/**
 * Display labels mapped to document type constants.
 * @type {Object}
 * @property {string} resume - "Resume"
 * @property {string} transcript - "Transcript"
 * @property {string} id_proof - "ID Proof"
 * @property {string} certificate - "Certificate"
 * @property {string} other - "Other"
 */
export const DOCUMENT_TYPE_LABELS = {
  resume: 'Resume',
  transcript: 'Transcript',
  id_proof: 'ID Proof',
  certificate: 'Certificate',
  other: 'Other'
};
