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

export const getStudentById = async (id) => {
  try {
    const response = await API.get(`/api/v1/admin/students/${id}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentProgress = async (id) => {
  try {
    const response = await API.get(`/api/v1/admin/students/${id}/progress`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudents = async (params = {}) => {
  try {
    const response = await API.get("/api/v1/admin/students", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const verifyStudent = async (studentId) => {
  try {
    const response = await API.patch(
      `/api/v1/admin/students/${studentId}/verify`,
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying student:", error);
    throw error;
  }
};

export const blockStudent = async (studentId, reason) => {
  try {
    const response = await API.patch(
      `/api/v1/admin/students/${studentId}/block`,
      { reason },
    );
    return response.data;
  } catch (error) {
    console.error("Error blocking student:", error);
    throw error;
  }
};

export const unblockStudent = async (studentId) => {
  try {
    const response = await API.patch(
      `/api/v1/admin/students/${studentId}/unblock`,
    );
    return response.data;
  } catch (error) {
    console.error("Error unblocking student:", error);
    throw error;
  }
};

export const resetStudentPassword = async (studentId) => {
  try {
    const response = await API.post(
      `/api/v1/admin/students/${studentId}/reset-pw`,
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const exportStudents = async (params = {}) => {
  try {
    const response = await API.get("/api/v1/admin/students/export", {
      params,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error exporting students:", error);
    throw error;
  }
};

const mockPrograms = [
  {
    id: "course_201",
    title: "MERN Full Stack",
    targetRole: "Web Developer",
    mentor: {
      id: "mentor_001",
      name: "Rohit Sharma",
    },
    modulesCount: 8,
    enrollment: 48,
    completionRate: "78%",
    status: "active",
  },
];

const USE_MOCK_LMS = true;

export const adminService = {

  async getTrainingAnalytics(programId) {
    const response = await API.get(
      `/api/v1/admin/courses/${programId}/analytics`,
      getConfig(),
    );

    return response.data;
  },

  async createTrainingProgram(payload) {
    const response = await API.post(
      "/api/v1/admin/courses",
      payload,
      getConfig(),
    );

    return response.data;
  },

  async getTrainingPrograms() {
    if (USE_MOCK_LMS) {
      return {
        courses: mockPrograms,
        total: mockPrograms.length,
        page: 1,
        limit: 20,
      };
    }

    const response = await API.get("/api/v1/admin/courses", getConfig());
    return response.data;
  },

  async getTrainingProgramById(programId) {
    const response = await API.get(
      `/api/v1/admin/courses/${programId}`,
      getConfig(),
    );

    return response.data;
  },

  async updateTrainingProgram(programId, payload) {
    const response = await API.put(
      `/api/v1/admin/courses/${programId}`,
      payload,
      getConfig(),
    );

    return response.data;
  },

  async assignMentor(programId, mentorId) {
    const response = await API.patch(
      `/api/v1/admin/courses/${programId}/assign-mentor`,
      { mentorId },
      getConfig(),
    );

    return response.data;
  },

  async archiveTrainingProgram(programId) {
    const response = await API.delete(
      `/api/v1/admin/courses/${programId}`,
      getConfig(),
    );

    return response.data;
  },

  async addModule(programId, moduleData) {
    const response = await API.post(
      `/api/v1/admin/courses/${programId}/modules`,
      moduleData,
      getConfig(),
    );

    return response.data;
  },

  async updateModule(programId, moduleId, payload) {
    const response = await API.put(
      `/api/v1/admin/courses/${programId}/modules/${moduleId}`,
      payload,
      getConfig(),
    );

    return response.data;
  },

  async deleteModule(programId, moduleId) {
    const response = await API.delete(
      `/api/v1/admin/courses/${programId}/modules/${moduleId}`,
      getConfig(),
    );

    return response.data;
  },
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
  const response = await API.get("/api/v1/admin/dashboard/stats", getConfig());
  return response.data;
};

export const fetchDashboardFunnel = async () => {
  const response = await API.get("/api/v1/admin/dashboard/funnel", getConfig());
  return response.data;
};

export const fetchCompanyStats = async () => {
  const response = await API.get(
    "/api/v1/admin/dashboard/company-stats",
    getConfig(),
  );
  return response.data;
};

export const fetchCollegePerformance = async () => {
  const response = await API.get(
    "/api/v1/admin/dashboard/college-performance",
    getConfig(),
  );
  return response.data;
};

export const fetchActivityFeed = async () => {
  const response = await API.get(
    "/api/v1/admin/dashboard/activity-feed",
    getConfig(),
  );
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
const USE_MOCK_DATA = false;

export const createDrive = async (driveData) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      drive: {
        id: `drive_${Date.now()}`,
        ...driveData,
        status: "active",
        currentStage: "application",
        candidates: 0,
      },
    };
  }

  try {
    const response = await API.post(
      "/api/v1/admin/drives",
      driveData,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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

export const assignAssessment = async (assessmentId, payload) => {
  const response = await API.post(
    `/api/v1/admin/assessments/${assessmentId}/assign`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

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

// Mentor Management APIs

export const getMentors = async () => {
  if (USE_MOCK_DATA) {
    return mockMentors;
  }

  try {
    const response = await API.get("/api/v1/admin/mentors");
    return response.data;
  } catch (error) {
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
    return { success: true, mentorId };
  }
};
/* ===========================================
   Disputes
=========================================== */

export const getDisputes = async (params = {}) => {
  const response = await API.get(
    "/api/v1/admin/disputes",
    {
      ...getConfig(),
      params,
    }
  );

  return response.data;
};

export const getDisputeById = async (id) => {
  const response = await API.get(
    `/api/v1/admin/disputes/${id}`,
    getConfig()
  );

  return response.data;
};

export const reviewDispute = async (id) => {
  const response = await API.patch(
    `/api/v1/admin/disputes/${id}/review`,
    {},
    getConfig()
  );

  return response.data;
};

export const resolveDispute = async (id, resolution) => {
  const response = await API.patch(
    `/api/v1/admin/disputes/${id}/resolve`,
    { resolution },
    getConfig()
  );

  return response.data;
};

export const escalateDispute = async (id, reason) => {
  const response = await API.patch(
    `/api/v1/admin/disputes/${id}/escalate`,
    { reason },
    getConfig()
  );

  return response.data;
};

export const addDisputeNote = async (id, note) => {
  const response = await API.post(
    `/api/v1/admin/disputes/${id}/notes`,
    { note },
    getConfig()
  );

  return response.data;
};

// Mock Notification Data

const mockNotifications = [
  {
    id: "notif_501",
    subject: "MERN Drive Now Open",
    recipientCount: 1432,
    status: "sent",
  },
];

const mockTemplates = [
  {
    id: "tmpl_001",
    name: "Drive Opening",
    subject: "New Drive Now Open",
  },
];

// =========================
// Notification APIs
// =========================

export const sendNotification = async (payload) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      message: "Notification sent successfully",
      notification: {
        id: "notif_501",
        ...payload,
        status: "sent",
      },
    };
  }

  try {
    const response = await API.post(
      "/api/v1/admin/notifications/send",
      payload,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const scheduleNotification = async (payload) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      message: "Notification scheduled successfully",
      notification: {
        id: "notif_502",
        ...payload,
        status: "scheduled",
      },
    };
  }

  try {
    const response = await API.post(
      "/api/v1/admin/notifications/schedule",
      payload,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getNotificationTemplates = async () => {
  if (USE_MOCK_DATA) {
    return {
      templates: mockTemplates,
    };
  }

  try {
    const response = await API.get(
      "/api/v1/admin/notifications/templates",
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);

    return {
      templates: mockTemplates,
    };
  }
};

export const createNotificationTemplate = async (payload) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      template: {
        id: `tmpl_${Date.now()}`,
        ...payload,
      },
    };
  }

  try {
    const response = await API.post(
      "/api/v1/admin/notifications/templates",
      payload,
      getConfig(),
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};