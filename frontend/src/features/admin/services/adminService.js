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
  const response = await API.put("/profile", profileData, getConfig());
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
};

// Mock Mentor Data - Fallback when backend is unavailable
const mockMentors = [
  {
    id: "mentor_001",
    name: "Rohit Sharma",
    email: "rohit@uptoskills.com",
    expertise: ["MERN", "React", "Node.js"],
    rating: 4.8,
    activeBatches: 3,
    isActive: true,
  },
  {
    id: "mentor_002",
    name: "Priya Singh",
    email: "priya@uptoskills.com",
    expertise: ["AI/ML", "Python"],
    rating: 4.2,
    activeBatches: 1,
    isActive: true,
  },
  {
    id: "mentor_003",
    name: "Arjun Das",
    email: "arjun@uptoskills.com",
    expertise: ["Java", "Spring Boot"],
    rating: 3.8,
    activeBatches: 0,
    isActive: false,
  },
];

const mockMentorPerformance = {
  mentor: {
    id: "mentor_001",
    name: "Rohit Sharma",
  },
  rating: 4.8,
  totalReviews: 32,
  completionRate: "87%",
  avgAssignmentScore: 74,
  recentFeedback: [
    {
      studentId: "stu_001",
      rating: 5,
      comment: "Very helpful and clear explanations.",
    },
    {
      studentId: "stu_002",
      rating: 4,
      comment: "Good depth on backend topics.",
    },
  ],
  batchHistory: [
    {
      driveId: "drive_101",
      batchId: "batch_301",
      title: "MERN Batch 1",
      status: "active",
    },
    {
      driveId: "drive_099",
      batchId: "batch_280",
      title: "React Dev Batch",
      status: "completed",
    },
  ],
};

// Feature Flag: Use mock data instead of backend APIs
// Set to false to use real backend APIs (when available)
let USE_MOCK_DATA = true;

// Mentor Management APIs

export const getMentors = async () => {
  if (USE_MOCK_DATA) {
    return mockMentors;
  }

  try {
    const response = await API.get("/api/v1/admin/mentors");
    return response.data;
  } catch (error) {
    console.log(error);
    return mockMentors;
  }
};

export const getMentorById = async (mentorId) => {
  if (USE_MOCK_DATA) {
    const mentor = mockMentors.find((m) => m.id === mentorId);
    return mentor || mockMentors[0];
  }

  try {
    const response = await API.get(`/api/v1/admin/mentors/${mentorId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    const mentor = mockMentors.find((m) => m.id === mentorId);
    return mentor || mockMentors[0];
  }
};

export const getMentorPerformance = async (mentorId) => {
  if (USE_MOCK_DATA) {
    return {
      ...mockMentorPerformance,
      mentor: {
        ...mockMentorPerformance.mentor,
        id: mentorId,
      },
    };
  }

  try {
    const response = await API.get(
      `/api/v1/admin/mentors/${mentorId}/performance`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      ...mockMentorPerformance,
      mentor: {
        ...mockMentorPerformance.mentor,
        id: mentorId,
      },
    };
  }
};

export const createMentor = async (mentorData) => {
  if (USE_MOCK_DATA) {
    return { success: true, data: mentorData };
  }

  try {
    const response = await API.post("/api/v1/admin/mentors", mentorData);
    return response.data;
  } catch (error) {
    console.log(error);
    return { success: true, data: mentorData };
  }
};

export const assignMentor = async (mentorId, batchId) => {
  if (USE_MOCK_DATA) {
    return { success: true, mentorId, batchId };
  }

  try {
    const response = await API.patch(
      `/api/v1/admin/mentors/${mentorId}/assign`,
      { batchId },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return { success: true, mentorId, batchId };
  }
};

export const replaceMentor = async (mentorId, newMentorId) => {
  if (USE_MOCK_DATA) {
    return { success: true, mentorId, newMentorId };
  }

  try {
    const response = await API.patch(
      `/api/v1/admin/mentors/${mentorId}/replace`,
      { newMentorId },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return { success: true, mentorId, newMentorId };
  }
};

export const deleteMentor = async (mentorId) => {
  if (USE_MOCK_DATA) {
    return { success: true, mentorId };
  }

  try {
    const response = await API.delete(`/api/v1/admin/mentors/${mentorId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return { success: true, mentorId };
  }
};
