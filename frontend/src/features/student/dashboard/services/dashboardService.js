import { mockDashboardData } from "./dashboardDummyData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_BASE_URL}/api/student/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      return await res.json();
    }

    if (res.status === 404) {
      // Endpoint not ready on backend yet -> fallback to mock data
      return mockDashboardData;
    }

    throw new Error(`Failed to load dashboard (status: ${res.status})`);
  } catch (err) {
    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      // Local dev server offline fallback
      return mockDashboardData;
    }
    throw err;
  }
};