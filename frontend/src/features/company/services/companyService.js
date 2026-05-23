import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/company",
});

/* Add Token To Every Request */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* Dashboard Stats */

export const getDashboardStats = async () => {
  const response = await API.get(
    "/dashboard/stats"
  );

  return response.data;
};

/* Funnel Data */

export const getFunnelData = async () => {
  const response = await API.get(
    "/dashboard/funnel"
  );

  return response.data;
};

/* College Stats */

export const getCollegeStats = async () => {
  const response = await API.get(
    "/dashboard/college-stats"
  );

  return response.data;
};

/* Activity Feed */

export const getActivityFeed = async () => {
  const response = await API.get(
    "/dashboard/activity"
  );

  return response.data;
};