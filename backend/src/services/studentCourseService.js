import studentCourseModel from '../models/studentCourseModel.js';

export const listCourses = async (studentId) => {
  return studentCourseModel.listStudentCourses(studentId);
};

export const getCourse = async (studentId, courseId) => {
  const course = await studentCourseModel.getStudentCourseById(studentId, courseId);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }
  return course;
};

export const updateLessonProgress = async (studentId, courseId, lessonId, completed) => {
  const progress = await studentCourseModel.updateLessonProgress(
    studentId,
    courseId,
    lessonId,
    completed,
  );

  if (!progress) {
    const error = new Error('Lesson not found for this course');
    error.statusCode = 404;
    throw error;
  }

  return progress;
};

export default {
  listCourses,
  getCourse,
  updateLessonProgress,
};
