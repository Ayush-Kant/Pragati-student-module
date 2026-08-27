import { mockDashboardData, mockLeaderboardData } from "../data/dashboardDummyData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchStudentDashboard = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/student/dashboard`, {
      headers: getAuthHeaders()
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    const json = await res.json();
    return json.data || json;
  } catch {
    // Fallback to mock data during local development
    return new Promise((resolve) => setTimeout(() => resolve(mockDashboardData), 400));
  }
};

export const fetchLeaderboard = async (driveId) => {
  if (!driveId) return mockLeaderboardData;
  try {
    const res = await fetch(`${API_BASE_URL}/student/dashboard/leaderboard/${driveId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    const json = await res.json();
    return json.leaderboard || json;
  } catch {
    return new Promise((resolve) => setTimeout(() => resolve(mockLeaderboardData), 400));
  }
};