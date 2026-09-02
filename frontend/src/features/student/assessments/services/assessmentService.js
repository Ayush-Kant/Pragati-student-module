import api from "../../../../services/api";

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getAssessments = async () => {
  const response = await api.get("/student/assessments");
  return unwrap(response);
};

export const getAssessmentById = async (id) => {
  const response = await api.get(`/student/assessments/${id}`);
  return unwrap(response);
};

export const startAssessment = async (id) => {
  const response = await api.post(`/student/assessments/${id}/start`);
  return unwrap(response);
};

export const saveAssessmentAnswer = async (attemptId, questionId, answer) => {
  const response = await api.put(
    `/student/assessments/attempts/${attemptId}/questions/${questionId}/answer`,
    { answer },
  );
  return unwrap(response);
};

export const recordTabSwitch = async (attemptId) => {
  const response = await api.post(`/student/assessments/attempts/${attemptId}/tab-switch`);
  return unwrap(response);
};

export const submitAssessment = async (attemptId, reason = "submitted") => {
  const response = await api.post(`/student/assessments/attempts/${attemptId}/submit`, {
    reason,
  });
  return unwrap(response);
};

export const getAssessmentResult = async (attemptId) => {
  const response = await api.get(`/student/assessments/attempts/${attemptId}/result`);
  return unwrap(response);
};

export const getAssessmentHistory = async () => {
  const response = await api.get("/student/assessments/history");
  return unwrap(response);
};
