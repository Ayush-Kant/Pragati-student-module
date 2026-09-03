import api from '../../../services/api';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getCourses = async () => {
  const response = await api.get('/student/courses');
  return unwrap(response);
};

export const getCourseById = async (courseId) => {
  const response = await api.get(`/student/courses/${courseId}`);
  return unwrap(response);
};

export const getLessonById = async (lessonId) => {
  const response = await api.get(`/student/courses/lessons/${lessonId}`);
  return unwrap(response);
};

export const saveLessonWatchProgress = async (lessonId, watchedSeconds, totalSeconds) => {
  const response = await api.post(
    `/student/courses/lessons/${lessonId}/progress`,
    { watchedSeconds, totalSeconds },
  );
  return unwrap(response);
};

export const updateLessonProgress = async (courseId, lessonId, completed) => {
  const response = await api.patch(
    `/student/courses/${courseId}/lessons/${lessonId}/progress`,
    { completed },
  );
  return unwrap(response);
};

export const getLessonNotes = async (lessonId) => {
  const response = await api.get(`/student/courses/lessons/${lessonId}/notes`);
  return unwrap(response);
};

export const saveLessonNote = async (lessonId, payload) => {
  const response = payload?.noteId
    ? await api.patch(`/student/courses/lessons/${lessonId}/notes/${payload.noteId}`, payload)
    : await api.post(`/student/courses/lessons/${lessonId}/notes`, payload);
  return unwrap(response);
};

export const deleteLessonNote = async (lessonId, noteId) => {
  const response = await api.delete(`/student/courses/lessons/${lessonId}/notes/${noteId}`);
  return unwrap(response);
};

export const downloadResource = async (resourceId) => {
  const response = await api.get(`/student/courses/resources/${resourceId}/download`);
  return unwrap(response);
};
