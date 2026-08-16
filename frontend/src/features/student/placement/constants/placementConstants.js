// src/features/student/placement/constants/placementConstants.js
// Single source of truth for all placement-module enumerations, thresholds, and route paths.

// ─── Application Status ──────────────────────────────────────────────────────
export const APPLICATION_STATUS = Object.freeze({
  APPLIED:      'Applied',
  SHORTLISTED:  'Shortlisted',
  ASSESSMENT:   'Assessment',
  INTERVIEW:    'Interview',
  SELECTED:     'Selected',
  REJECTED:     'Rejected',
  WITHDRAWN:    'Withdrawn',
});

// Ordered pipeline progression (used for timeline rendering — do NOT reorder)
export const APPLICATION_STATUS_ORDER = [
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.SHORTLISTED,
  APPLICATION_STATUS.ASSESSMENT,
  APPLICATION_STATUS.INTERVIEW,
  APPLICATION_STATUS.SELECTED,
];

// Terminal statuses — no further progression expected
export const TERMINAL_STATUSES = new Set([
  APPLICATION_STATUS.SELECTED,
  APPLICATION_STATUS.REJECTED,
  APPLICATION_STATUS.WITHDRAWN,
]);

// ─── Job Type ────────────────────────────────────────────────────────────────
export const JOB_TYPE = Object.freeze({
  FULL_TIME:   'Full-Time',
  PART_TIME:   'Part-Time',
  INTERNSHIP:  'Internship',
  CONTRACT:    'Contract',
  FREELANCE:   'Freelance',
  REMOTE:      'Remote',
});

// ─── Skill Levels ────────────────────────────────────────────────────────────
export const SKILL_LEVEL = Object.freeze({
  BEGINNER:     'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED:     'Advanced',
  EXPERT:       'Expert',
});

// ─── Assessment Types ────────────────────────────────────────────────────────
export const ASSESSMENT_TYPE = Object.freeze({
  APTITUDE:      'Aptitude',
  TECHNICAL:     'Technical',
  CODING:        'Coding',
  COMMUNICATION: 'Communication',
  PSYCHOMETRIC:  'Psychometric',
});

// ─── Resume Status ───────────────────────────────────────────────────────────
export const RESUME_STATUS = Object.freeze({
  NOT_UPLOADED: 'Not Uploaded',
  UPLOADED:     'Uploaded',
  UNDER_REVIEW: 'Under Review',
  APPROVED:     'Approved',
  NEEDS_UPDATE: 'Needs Update',
});

// ─── Readiness Score Thresholds ──────────────────────────────────────────────
// Backend provides the authoritative score; these thresholds are used for UI
// formatting only (color coding, labels) — never for calculating a score.
export const READINESS_THRESHOLD = Object.freeze({
  EXCELLENT: 85,  // score >= 85 → excellent (green)
  GOOD:      70,  // score >= 70 → good (teal)
  FAIR:      50,  // score >= 50 → fair (amber)
  POOR:       0,  // score <  50 → poor (red)
});

export const READINESS_LABEL = Object.freeze({
  EXCELLENT: 'Excellent',
  GOOD:      'Good',
  FAIR:      'Fair',
  POOR:      'Needs Work',
});

// ─── Profile Completion Thresholds ──────────────────────────────────────────
export const PROFILE_COMPLETION_THRESHOLD = Object.freeze({
  COMPLETE:    90,
  GOOD:        70,
  INCOMPLETE:   0,
});

// ─── Pagination ──────────────────────────────────────────────────────────────
export const PAGE_SIZE_OPTIONS = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;

// ─── Debounce ────────────────────────────────────────────────────────────────
export const FILTER_DEBOUNCE_MS = 300;

// ─── Query Keys ─────────────────────────────────────────────────────────────
// Centralised TanStack Query keys to ensure cache consistency across hooks.
export const QUERY_KEYS = Object.freeze({
  PLACEMENT_DASHBOARD:  ['placement', 'dashboard'],
  CAREER_PROFILE:       ['placement', 'profile'],
  SKILL_READINESS:      ['placement', 'skills'],
  ASSESSMENTS:          ['placement', 'assessments'],
  APPLICATIONS:         ['placement', 'applications'],
  APPLICATION_DETAIL:   (id) => ['placement', 'applications', id],
  READINESS_REPORT:     ['placement', 'readiness'],
  RECOMMENDATIONS:      ['placement', 'recommendations'],
});

// ─── TanStack Query Stale Times ──────────────────────────────────────────────
export const STALE_TIME = Object.freeze({
  SHORT:    1  * 60 * 1000,  //  1 minute
  MEDIUM:   5  * 60 * 1000,  //  5 minutes
  LONG:     15 * 60 * 1000,  // 15 minutes
});

// ─── Route Paths ─────────────────────────────────────────────────────────────
export const PLACEMENT_ROUTES = Object.freeze({
  DASHBOARD:           '/student/placement',
  CAREER_PROFILE:      '/student/placement/profile',
  JOB_APPLICATIONS:    '/student/placement/applications',
  APPLICATION_DETAILS: '/student/placement/applications/:applicationId',
  READINESS_REPORT:    '/student/placement/readiness',
});

export const buildApplicationDetailsRoute = (applicationId) =>
  `/student/placement/applications/${applicationId}`;

// ─── Recommendation Priority ─────────────────────────────────────────────────
export const RECOMMENDATION_PRIORITY = Object.freeze({
  HIGH:   'High',
  MEDIUM: 'Medium',
  LOW:    'Low',
});

// ─── Date Ranges (for filters) ───────────────────────────────────────────────
export const DATE_RANGE_PRESET = Object.freeze({
  LAST_7_DAYS:  'last_7',
  LAST_30_DAYS: 'last_30',
  LAST_90_DAYS: 'last_90',
  CUSTOM:       'custom',
  ALL_TIME:     'all',
});

// ─── Profile Sections (incomplete-section navigation) ────────────────────────
export const PROFILE_SECTION = Object.freeze({
  BASIC_INFO:      'basic_info',
  EDUCATION:       'education',
  SKILLS:          'skills',
  CERTIFICATIONS:  'certifications',
  PROJECTS:        'projects',
  INTERNSHIPS:     'internships',
  PREFERENCES:     'preferences',
  RESUME:          'resume',
});

export const PROFILE_SECTION_LABEL = Object.freeze({
  [PROFILE_SECTION.BASIC_INFO]:     'Basic Information',
  [PROFILE_SECTION.EDUCATION]:      'Education',
  [PROFILE_SECTION.SKILLS]:         'Technical Skills',
  [PROFILE_SECTION.CERTIFICATIONS]: 'Certifications',
  [PROFILE_SECTION.PROJECTS]:       'Projects',
  [PROFILE_SECTION.INTERNSHIPS]:    'Internships',
  [PROFILE_SECTION.PREFERENCES]:    'Career Preferences',
  [PROFILE_SECTION.RESUME]:         'Resume',
});
