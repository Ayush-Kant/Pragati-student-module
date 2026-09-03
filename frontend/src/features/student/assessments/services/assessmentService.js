import api from "../../../../services/api";

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getAssessments = async ({ status = "all" } = {}) => unwrap(await api.get("/student/assessments", { params: status && status !== "all" ? { status } : undefined }));
export const getAssessmentById = async (id) => unwrap(await api.get(`/student/assessments/${id}`));
export const startAssessment = async (id) => unwrap(await api.post(`/student/assessments/${id}/start`));
export const saveAssessmentAnswer = async (attemptId, questionId, answer) => unwrap(await api.put(`/student/assessments/attempts/${attemptId}/questions/${questionId}/answer`, { answer }));
export const recordTabSwitch = async (attemptId) => unwrap(await api.post(`/student/assessments/attempts/${attemptId}/tab-switch`));
export const submitAssessment = async (attemptId, payload = {}) => unwrap(await api.post(`/student/assessments/attempts/${attemptId}/submit`, payload));
export const getAssessmentResult = async (attemptId) => unwrap(await api.get(`/student/assessments/attempts/${attemptId}/result`));
export const getAssessmentReview = async (assessmentId) => unwrap(await api.get(`/student/assessments/${assessmentId}/review`));
export const getAssessmentHistory = async () => unwrap(await api.get("/student/assessments/history"));
