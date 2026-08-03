export const PROFILE_SECTIONS = {
  PERSONAL: 'personal',
  CONTACT: 'contact',
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
