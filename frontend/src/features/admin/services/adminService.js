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
// Mentors
// ─────────────────────────────────────────────────────────────────────────────

export const getMentors = async () => {
  try {
    const response = await api.get("/api/v1/admin/mentors");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createMentor = async (mentorData) => {
  try {
    const response = await api.post("/api/v1/admin/mentors", mentorData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteMentor = async (mentorId) => {
  try {
    const response = await api.delete(`/api/v1/admin/mentors/${mentorId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const assignMentor = async (mentorId, batchId) => {
  try {
    const response = await api.post(`/api/v1/admin/mentors/${mentorId}/assign`, {
      batchId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const replaceMentor = async (mentorId, newMentorId) => {
  try {
    const response = await api.patch(`/api/v1/admin/mentors/${mentorId}/replace`, {
      newMentorId,
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
