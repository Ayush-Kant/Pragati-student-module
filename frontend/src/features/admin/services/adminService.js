import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const getAdminProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

export const updateAdminProfile = async (profileData) => {
  const response = await API.put("/profile", profileData);
  return response.data;
};

//For college needing recruitment
export const getNeedsRecruitment = async () => {
  try {
    const response = await API.get("/api/v1/admin/colleges/needs-recruitment");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//To fetch rankings of college
export const getCollegeRankings = async () => {
  try {
    const response = await API.get("/api/v1/admin/colleges/rankings");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const approveCollege = async (id) => {
  try {
    const response = await API.put(`/api/v1/admin/colleges/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectCollege = async (id, reason) => {
  try {
    const response = await API.put(`/api/v1/admin/colleges/${id}/reject`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const suspendCollege = async (id, reason) => {
  try {
    const response = await API.put(`/api/v1/admin/colleges/${id}/suspend`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchDashboardStats = async () => {
  const response = await API.get("/api/admin/dashboard/stats");
  return response.data;
};

export const fetchDashboardFunnel = async () => {
  const response = await API.get("/api/admin/dashboard/funnel");
  return response.data;
};

export const fetchCompanyStats = async () => {
  const response = await API.get("/api/admin/dashboard/company-stats");
  return response.data;
};

export const fetchCollegePerformance = async () => {
  const response = await API.get("/api/admin/dashboard/college-performance");
  return response.data;
};

export const fetchActivityFeed = async () => {
  const response = await API.get("/api/admin/dashboard/activity-feed");
  return response.data;
<<<<<<< HEAD
};
=======
};
>>>>>>> parent of cd46b91 (Merge branch 'develop' into feature/admin-student-management-be)
