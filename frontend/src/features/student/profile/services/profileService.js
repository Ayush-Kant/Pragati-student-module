// profileService.js
// Service layer — all API calls for Student Profile module
// src/features/student/profile/services/profileService.js

import { profileApiResponse } from "../types/profileDummyData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Helper — simulate API delay with dummy data ───────
// Remove this when real backend is ready
const simulateApi = (data, delay = 600) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

// ─────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────

export const getStudentProfile = async (studentId) => {
  // TODO: Replace with real API when backend is ready
  // const res = await fetch(`${BASE_URL}/api/students/${studentId}`, {
  //   headers: getHeaders(),
  // });
  // if (!res.ok) throw new Error("Failed to fetch profile");
  // return res.json();

  return simulateApi(profileApiResponse.data.overview);
};

export const updateStudentProfile = async (studentId, data) => {
  // TODO: Replace with real API
  // const res = await fetch(`${BASE_URL}/api/students/${studentId}`, {
  //   method: "PUT",
  //   headers: getHeaders(),
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Failed to update profile");
  // return res.json();

  return simulateApi({ success: true, updatedStudent: data });
};

// ─────────────────────────────────────────────────────
// RESUME
// ─────────────────────────────────────────────────────

export const uploadResume = async (studentId, file) => {
  // TODO: Replace with real API
  // const formData = new FormData();
  // formData.append("resume", file);
  // const res = await fetch(`${BASE_URL}/api/students/${studentId}/resume`, {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //   body: formData,
  // });
  // if (!res.ok) throw new Error("Failed to upload resume");
  // return res.json();

  return simulateApi({
    success: true,
    resumeUrl: URL.createObjectURL(file),
    filename: file.name,
    uploadedAt: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
  });
};

export const getResumeData = async (studentId) => {
  return simulateApi(profileApiResponse.data.resume);
};

// ─────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────

export const getSkills = async (studentId) => {
  return simulateApi(profileApiResponse.data.skills);
};

export const updateSkills = async (studentId, skills) => {
  return simulateApi({ success: true, skills });
};

// ─────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────

export const getProjects = async (studentId) => {
  return simulateApi(profileApiResponse.data.projects);
};

export const addProject = async (studentId, project) => {
  return simulateApi({ success: true, project });
};

// ─────────────────────────────────────────────────────
// PORTFOLIO
// ─────────────────────────────────────────────────────

export const getPortfolio = async (studentId) => {
  return simulateApi(profileApiResponse.data.portfolio);
};

export const updatePortfolio = async (studentId, data) => {
  return simulateApi({ success: true, portfolio: data });
};

// ─────────────────────────────────────────────────────
// SOCIAL LINKS
// ─────────────────────────────────────────────────────

export const getSocialLinks = async (studentId) => {
  return simulateApi(profileApiResponse.data.socialLinks);
};

export const updateSocialLinks = async (studentId, data) => {
  return simulateApi({ success: true, socialLinks: data });
};
