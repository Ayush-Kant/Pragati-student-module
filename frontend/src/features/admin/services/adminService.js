import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const API = axios.create({
  baseURL: API_URL,
});

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
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

/* =========================
   ADMIN PROFILE
========================= */

export const getAdminProfile = async () => {
  const response = await API.get("/profile", getConfig());
  return response.data;
};

export const updateAdminProfile = async (profileData) => {
  const response = await API.put(
    "/profile",
    profileData,
    getConfig()
  );
  return response.data;
};

/* =========================
   MENTOR MANAGEMENT
========================= */

// Get all mentors
export const getMentors = async () => {
  const response = await API.get(
    "/mentors",
    getConfig()
  );
  return response.data;
};

// Get mentor details
export const getMentorById = async (mentorId) => {
  const response = await API.get(
    `/mentors/${mentorId}`,
    getConfig()
  );
  return response.data;
};

// Get mentor performance
export const getMentorPerformance = async (mentorId) => {
  const response = await API.get(
    `/mentors/${mentorId}/performance`,
    getConfig()
  );
  return response.data;
};

// Register mentor
export const registerMentor = async (mentorData) => {
  const response = await API.post(
    "/mentors",
    mentorData,
    getConfig()
  );
  return response.data;
};

// Assign mentor to batch
export const assignMentor = async (
  mentorId,
  assignData
) => {
  const response = await API.patch(
    `/mentors/${mentorId}/assign`,
    assignData,
    getConfig()
  );
  return response.data;
};

// Replace mentor
export const replaceMentor = async (
  mentorId,
  replaceData
) => {
  const response = await API.patch(
    `/mentors/${mentorId}/replace`,
    replaceData,
    getConfig()
  );
  return response.data;
};

// Delete mentor
export const removeMentor = async (mentorId) => {
  const response = await API.delete(
    `/mentors/${mentorId}`,
    getConfig()
  );
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
