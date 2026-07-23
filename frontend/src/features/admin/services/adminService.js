import api from "../../../services/api";

// ─────────────────────────────────────────────────────────────────────────────
// Admin Profile
// ─────────────────────────────────────────────────────────────────────────────

export const getAdminProfile = async () => {
  const response = await api.get("/api/v1/admin/profile");
  return response.data;
};

export const updateAdminProfile = async (profileData) => {
  const response = await api.put("/api/v1/admin/profile", profileData);
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Students
// ─────────────────────────────────────────────────────────────────────────────

export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/api/v1/admin/students/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentProgress = async (id) => {
  try {
    const response = await api.get(`/api/v1/admin/students/${id}/progress`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudents = async (params = {}) => {
  try {
    const response = await api.get("/api/v1/admin/students", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const verifyStudent = async (studentId) => {
  try {
    const response = await api.patch(
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
    const response = await api.patch(
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
    const response = await api.patch(
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
    const response = await api.post(
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
    const response = await api.get("/api/v1/admin/students/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting students:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Colleges
// ─────────────────────────────────────────────────────────────────────────────

// For colleges needing recruitment
export const getNeedsRecruitment = async () => {
  try {
    const response = await api.get("/api/v1/admin/colleges/needs-recruitment");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Fetch rankings of colleges
export const getCollegeRankings = async () => {
  try {
    const response = await api.get("/api/v1/admin/colleges/rankings");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const approveCollege = async (id) => {
  try {
    const response = await api.put(`/api/v1/admin/colleges/${id}/approve`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const rejectCollege = async (id, reason) => {
  try {
    const response = await api.put(`/api/v1/admin/colleges/${id}/reject`, {
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
    const response = await api.put(`/api/v1/admin/colleges/${id}/suspend`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export const fetchDashboardStats = async () => {
  const response = await api.get("/api/v1/admin/dashboard/stats");
  return response.data;
};

export const fetchDashboardFunnel = async () => {
  const response = await api.get("/api/v1/admin/dashboard/funnel");
  return response.data;
};

export const fetchCompanyStats = async () => {
  const response = await api.get("/api/v1/admin/dashboard/company-stats");
  return response.data;
};

export const fetchCollegePerformance = async () => {
  const response = await api.get("/api/v1/admin/dashboard/college-performance");
  return response.data;
};

export const fetchActivityFeed = async () => {
  const response = await api.get("/api/v1/admin/dashboard/activity-feed");
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Drives — Mock fallback data
// ─────────────────────────────────────────────────────────────────────────────

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

// Feature Flag: set to false to use real backend APIs (when available)
const USE_MOCK_DATA = true;

export const getDrives = async () => {
  try {
    const response = await api.get("/api/v1/admin/drives");
    return response.data;
  } catch (error) {
    console.log(error);
    return mockDrives;
  }
};

export const getDriveById = async (driveId) => {
  if (USE_MOCK_DATA) {
    return mockDriveDetail;
  }

  try {
    const response = await api.get(`/api/v1/admin/drives/${driveId}`);
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
    const response = await api.get(`/api/v1/admin/drives/${driveId}/candidates`);
    return response.data;
  } catch (error) {
    console.log(error);
    return mockCandidates;
  }
};

export const advanceDrive = async (driveId) => {
  if (USE_MOCK_DATA) {
    return { success: true, message: "Drive advanced successfully" };
  }

  try {
    const response = await api.patch(`/api/v1/admin/drives/${driveId}/advance`, {});
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const freezeDrive = async (driveId) => {
  if (USE_MOCK_DATA) {
    return { success: true, status: "frozen" };
  }

  try {
    const response = await api.patch(`/api/v1/admin/drives/${driveId}/freeze`, {});
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const unfreezeDrive = async (driveId) => {
  if (USE_MOCK_DATA) {
    return { success: true, status: "active" };
  }

  try {
    const response = await api.patch(`/api/v1/admin/drives/${driveId}/unfreeze`, {});
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const moveCandidate = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return { success: true, ...payload };
  }

  try {
    const response = await api.patch(
      `/api/v1/admin/drives/${driveId}/move-candidate`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const shortlistCandidates = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return { success: true, shortlistedCount: payload.topN };
  }

  try {
    const response = await api.patch(
      `/api/v1/admin/drives/${driveId}/shortlist`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const assignTest = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return { success: true, assignedTest: payload };
  }

  try {
    const response = await api.post(
      `/api/v1/admin/drives/${driveId}/assign-test`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const assignCourse = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return { success: true, assignedCourse: payload };
  }

  try {
    const response = await api.post(
      `/api/v1/admin/drives/${driveId}/assign-course`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateDrive = async (driveId, payload) => {
  if (USE_MOCK_DATA) {
    return { success: true, updatedDrive: payload };
  }

  try {
    const response = await api.put(`/api/v1/admin/drives/${driveId}`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Assessments
// ─────────────────────────────────────────────────────────────────────────────

export const getAssessmentById = async (assessmentId) => {
  const response = await api.get(`/api/v1/admin/assessments/${assessmentId}`);
  return response.data;
};

export const addQuestion = async (assessmentId, payload) => {
  const response = await api.post(
    `/api/v1/admin/assessments/${assessmentId}/questions`,
    payload,
  );
  return response.data;
};

export const updateQuestion = async (assessmentId, questionId, payload) => {
  const response = await api.put(
    `/api/v1/admin/assessments/${assessmentId}/questions/${questionId}`,
    payload,
  );
  return response.data;
};

export const deleteQuestion = async (assessmentId, questionId) => {
  const response = await api.delete(
    `/api/v1/admin/assessments/${assessmentId}/questions/${questionId}`,
  );
  return response.data;
};

export const publishAssessment = async (assessmentId) => {
  const response = await api.patch(
    `/api/v1/admin/assessments/${assessmentId}/publish`,
    {},
  );
  return response.data;
};

export const assignAssessment = async (assessmentId, payload) => {
  const response = await api.post(
    `/api/v1/admin/assessments/${assessmentId}/assign`,
    payload,
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Mentors
// ─────────────────────────────────────────────────────────────────────────────

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

export const getMentors = async () => {
  if (USE_MOCK_DATA) {
    return mockMentors;
  }

  try {
    const response = await api.get("/api/v1/admin/mentors");
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
    const response = await api.get(`/api/v1/admin/mentors/${mentorId}`);
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
    const response = await api.get(
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
    const response = await api.post("/api/v1/admin/mentors", mentorData);
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
    const response = await api.patch(
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
    const response = await api.patch(
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
    const response = await api.delete(`/api/v1/admin/mentors/${mentorId}`);
    return response.data;
  } catch (error) {
    return { success: true, mentorId };
  }
};

/* ===========================================
   Disputes
=========================================== */

export const getDisputes = async (params = {}) => {
  const response = await api.get("/api/v1/admin/disputes", { params });
  return response.data;
};

export const getDisputeById = async (id) => {
  const response = await api.get(`/api/v1/admin/disputes/${id}`);
  return response.data;
};

export const reviewDispute = async (id) => {
  const response = await api.patch(`/api/v1/admin/disputes/${id}/review`, {});
  return response.data;
};

export const resolveDispute = async (id, resolution) => {
  const response = await api.patch(`/api/v1/admin/disputes/${id}/resolve`, { resolution });
  return response.data;
};

export const escalateDispute = async (id, reason) => {
  const response = await api.patch(`/api/v1/admin/disputes/${id}/escalate`, { reason });
  return response.data;
};

export const addDisputeNote = async (id, note) => {
  const response = await api.post(`/api/v1/admin/disputes/${id}/notes`, { note });
  return response.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────

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
    const response = await api.post(
      "/api/v1/admin/notifications/send",
      payload,
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
    const response = await api.post(
      "/api/v1/admin/notifications/schedule",
      payload,
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
    const response = await api.get("/api/v1/admin/notifications/templates");
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
    const response = await api.post(
      "/api/v1/admin/notifications/templates",
      payload,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LMS / Training Programs
// ─────────────────────────────────────────────────────────────────────────────

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
    const response = await api.get(
      `/api/v1/admin/courses/${programId}/analytics`,
    );
    return response.data;
  },

  async createTrainingProgram(payload) {
    const response = await api.post("/api/v1/admin/courses", payload);
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

    const response = await api.get("/api/v1/admin/courses");
    return response.data;
  },

  async getTrainingProgramById(programId) {
    const response = await api.get(`/api/v1/admin/courses/${programId}`);
    return response.data;
  },

  async updateTrainingProgram(programId, payload) {
    const response = await api.put(
      `/api/v1/admin/courses/${programId}`,
      payload,
    );
    return response.data;
  },

  async assignMentor(programId, mentorId) {
    const response = await api.patch(
      `/api/v1/admin/courses/${programId}/assign-mentor`,
      { mentorId },
    );
    return response.data;
  },

  async archiveTrainingProgram(programId) {
    const response = await api.delete(`/api/v1/admin/courses/${programId}`);
    return response.data;
  },

  async addModule(programId, moduleData) {
    const response = await api.post(
      `/api/v1/admin/courses/${programId}/modules`,
      moduleData,
    );
    return response.data;
  },

  async updateModule(programId, moduleId, payload) {
    const response = await api.put(
      `/api/v1/admin/courses/${programId}/modules/${moduleId}`,
      payload,
    );
    return response.data;
  },

  async deleteModule(programId, moduleId) {
    const response = await api.delete(
      `/api/v1/admin/courses/${programId}/modules/${moduleId}`,
    );
    return response.data;
  },
};
