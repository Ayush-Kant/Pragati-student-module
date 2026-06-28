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

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

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

// Mock Drive Data - Fallback when backend is unavailable

const mockDrives = [
  {
    id: "drive_101",
    title: "MERN Batch 1",
    company: { id: "comp_001", name: "TechCorp Ltd" },
    status: "active",
    currentStage: "training",
    candidates: 120,
    createdAt: "2024-04-01T00:00:00Z",
  },
  {
    id: "drive_102",
    title: "Java Dev Drive",
    company: { id: "comp_003", name: "InfoSys" },
    status: "active",
    currentStage: "screening",
    candidates: 80,
    createdAt: "2024-04-15T00:00:00Z",
  },
  {
    id: "drive_103",
    title: "Data Science Drive",
    company: { id: "comp_002", name: "Analytics Plus" },
    status: "frozen",
    currentStage: "shortlist",
    candidates: 45,
    createdAt: "2024-03-10T00:00:00Z",
  },
];

const mockDriveDetail = {
  id: "drive_101",
  title: "MERN Stack Fresher Drive 2024",
  company: { id: "comp_001", name: "TechCorp Ltd" },
  status: "active",
  currentStage: "training",
  criteria: { minGpa: 7.0, maxOpenings: 30 },
  pipeline: {
    applied: 240,
    screened: 180,
    training: 120,
    shortlisted: 48,
    interviews: 0,
    selected: 0,
  },
  assignedTest: { id: "assess_403", title: "MERN Stack Screening Test" },
  assignedCourse: { id: "course_201", title: "MERN Full Stack Development" },
};

const mockCandidates = [
  {
    studentId: "stu_001",
    name: "Vedant Bende",
    college: "IIT Bombay",
    currentStage: "training",
    assessmentScore: 72,
    trainingCompletion: "80%",
  },
  {
    studentId: "stu_002",
    name: "Ankit A.",
    college: "BITS Pilani",
    currentStage: "training",
    assessmentScore: 68,
    trainingCompletion: "65%",
  },
  {
    studentId: "stu_003",
    name: "Mukesh C.",
    college: "Ranchi University",
    currentStage: "screened",
    assessmentScore: 55,
    trainingCompletion: "0%",
  },
];

export const PIPELINE_STAGES = [
  "application",
  "screening",
  "training",
  "shortlist",
  "interviews",
  "selection",
];

// Feature Flag: Use mock data instead of backend APIs
// Set to false to use real backend APIs (when available)
const USE_MOCK_DATA = true;
export const getDriveById = async (driveId) => {
  if (USE_MOCK_DATA) {
    return mockDriveDetail;
  }

  try {
    const response = await API.get(
      `/api/v1/admin/drives/${driveId}`,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    return mockDriveDetail;
  }
};

export const getCandidates = async (driveId) => {
  if (USE_MOCK_DATA) {
    return mockCandidates;
  }

  try {
    const response = await API.get(
      `/api/v1/admin/drives/${driveId}/candidates`,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    return mockCandidates;
  }
};

export const advanceDrive = async (driveId) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      message: "Drive advanced successfully",
    };
  }

  try {
    const response = await API.patch(
      `/api/v1/admin/drives/${driveId}/advance`,
      {},
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const freezeDrive = async (driveId) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      status: "frozen",
    };
  }

  try {
    const response = await API.patch(
      `/api/v1/admin/drives/${driveId}/freeze`,
      {},
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const unfreezeDrive = async (driveId) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      status: "active",
    };
  }

  try {
    const response = await API.patch(
      `/api/v1/admin/drives/${driveId}/unfreeze`,
      {},
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const moveCandidate = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      ...payload,
    };
  }

  try {
    const response = await API.patch(
      `/api/v1/admin/drives/${driveId}/move-candidate`,
      payload,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const shortlistCandidates = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      shortlistedCount: payload.topN,
    };
  }

  try {
    const response = await API.patch(
      `/api/v1/admin/drives/${driveId}/shortlist`,
      payload,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const assignTest = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      assignedTest: payload,
    };
  }

  try {
    const response = await API.post(
      `/api/v1/admin/drives/${driveId}/assign-test`,
      payload,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const assignCourse = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      assignedCourse: payload,
    };
  }

  try {
    const response = await API.post(
      `/api/v1/admin/drives/${driveId}/assign-course`,
      payload,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const updateDrive = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      updatedDrive: payload,
    };
  }

  try {
    const response = await API.put(
      `/api/v1/admin/drives/${driveId}`,
      payload,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

const getToken = () => localStorage.getItem("token");

export const getAssessmentById = async (assessmentId) => {
  const response = await API.get(`/api/v1/admin/assessments/${assessmentId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const addQuestion = async (assessmentId, payload) => {
  const response = await API.post(
    `/api/v1/admin/assessments/${assessmentId}/questions`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const updateQuestion = async (assessmentId, questionId, payload) => {
  const response = await API.put(
    `/api/v1/admin/assessments/${assessmentId}/questions/${questionId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const deleteQuestion = async (assessmentId, questionId) => {
  const response = await API.delete(
    `/api/v1/admin/assessments/${assessmentId}/questions/${questionId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const publishAssessment = async (assessmentId) => {
  const response = await API.patch(
    `/api/v1/admin/assessments/${assessmentId}/publish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const getDrives = async () => {
  const response = await API.get("/api/v1/admin/drives", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
export const getMentorPerformance = async (mentorId) => {
  const response = await API.get(
    `/api/v1/admin/mentors/${mentorId}/performance`,
    getConfig()
  );

  return response.data;
};



