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

export const updateLessonProgress = async (courseId, lessonId, completed) => {
  const response = await api.patch(
    `/student/courses/${courseId}/lessons/${lessonId}/progress`,
    { completed },
  );
  return unwrap(response);
};
