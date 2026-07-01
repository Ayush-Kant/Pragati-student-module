
import { dashboardApiResponse, leaderboardData } from "../types/dashboardDummyData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Helper — simulate API delay with dummy data ───────

const simulateApi = (data, delay = 600) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

// ─────────────────────────────────────────────────────
// FULL DASHBOARD (single combined call)
// ─────────────────────────────────────────────────────

export const getDashboardData = async (studentId) => {
  

  return simulateApi(dashboardApiResponse.data);
};


export const getLeaderboard = async () => {


  return simulateApi(leaderboardData);
};

// ─────────────────────────────────────────────────────
// INDIVIDUAL SECTIONS (used if components fetch independently)
// ─────────────────────────────────────────────────────

export const getActiveDrive = async (studentId) => {
  return simulateApi(dashboardApiResponse.data.activeDrive);
};

export const getQuickStats = async (studentId) => {
  return simulateApi(dashboardApiResponse.data.quickStats);
};

export const getProgressRing = async (studentId) => {
  return simulateApi(dashboardApiResponse.data.progressRing);
};

export const getUpcomingSessions = async (studentId) => {
  return simulateApi(dashboardApiResponse.data.upcomingSessions);
};

export const getPendingTasks = async (studentId) => {
  return simulateApi(dashboardApiResponse.data.pendingTasks);
};

export const getRecentNotifications = async (studentId) => {
  return simulateApi(dashboardApiResponse.data.recentNotifications);
};
