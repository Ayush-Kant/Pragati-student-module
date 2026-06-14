// profileConstants.js
// All constants for Student Profile module
// src/features/student/profile/constants/profileConstants.js

// ── API Endpoints ─────────────────────────────────────
export const PROFILE_API = {
  GET_PROFILE:     "/api/students/:id",
  UPDATE_PROFILE:  "/api/students/:id",
  UPLOAD_RESUME:   "/api/students/:id/resume",
  GET_SKILLS:      "/api/students/:id/skills",
  UPDATE_SKILLS:   "/api/students/:id/skills",
  GET_PROJECTS:    "/api/students/:id/projects",
  ADD_PROJECT:     "/api/students/:id/projects",
  GET_PORTFOLIO:   "/api/students/:id/portfolio",
  UPDATE_PORTFOLIO:"/api/students/:id/portfolio",
  GET_SOCIAL:      "/api/students/:id/social",
  UPDATE_SOCIAL:   "/api/students/:id/social",
};

// ── Status Options ────────────────────────────────────
export const PLACEMENT_STATUS = {
  PLACED:   "placed",
  ELIGIBLE: "eligible",
  TRAINING: "training",
};

// ── Resume ────────────────────────────────────────────
export const RESUME_MAX_SIZE_MB = 5;
export const RESUME_ALLOWED_TYPES = ["application/pdf"];

// ── Loading States ────────────────────────────────────
export const LOADING_STATES = {
  IDLE:    "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR:   "error",
};

// ── Default Values ────────────────────────────────────
export const DEFAULT_PROFILE = {
  name: "",
  email: "",
  phone: "",
  city: "",
  department: "",
  cgpa: "",
  skills: [],
  projects: [],
  resumeUrl: null,
};

// ── Departments ───────────────────────────────────────
export const DEPARTMENTS = [
  "Computer Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Telecommunication",
  "Electrical Engineering",
];

// ── Skill Suggestions ─────────────────────────────────
export const SUGGESTED_SKILLS = [
  "React", "Node.js", "Python", "Java", "C++",
  "JavaScript", "TypeScript", "SQL", "MongoDB",
  "PostgreSQL", "Git", "Docker", "AWS", "REST APIs",
];
