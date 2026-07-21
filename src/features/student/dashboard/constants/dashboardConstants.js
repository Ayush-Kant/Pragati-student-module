export const ACTIVITY_TYPES = {
  ASSIGNMENT: 'ASSIGNMENT',
  EXAM: 'EXAM',
  CLASS: 'CLASS',
  STUDY_SESSION: 'STUDY_SESSION',
  WEBINAR: 'WEBINAR'
};

export const NOTIFICATION_TYPES = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  SUCCESS: 'SUCCESS',
  DEADLINE: 'DEADLINE'
};

export const QUICK_ACTIONS = [
  { id: 'study', label: 'Start Studying', icon: 'BookOpen', description: 'Open your current learning module' },
  { id: 'grades', label: 'View Grades', icon: 'GraduationCap', description: 'Check your performance history' },
  { id: 'schedule', label: 'Class Schedule', icon: 'Calendar', description: 'See upcoming classes and webinars' },
  { id: 'profile', label: 'Complete Profile', icon: 'User', description: 'Update details for +10% progress' }
];

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.studentportal.local/v1',
  TIMEOUT_MS: 5000,
  MOCK_DELAY_MS: 600
};
