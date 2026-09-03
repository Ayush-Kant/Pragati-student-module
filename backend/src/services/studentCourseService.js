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

export const getLesson = async (studentId, lessonId) => {
  const lesson = await studentCourseModel.getStudentLessonById(studentId, lessonId);
  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }
  return lesson;
};

export const saveWatchProgress = async (studentId, lessonId, watchedSeconds, totalSeconds) => {
  return studentCourseModel.saveWatchProgress(
    studentId,
    lessonId,
    watchedSeconds,
    totalSeconds,
  );
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

export const getLessonNotes = async (studentId, lessonId) => {
  await getLesson(studentId, lessonId);
  return studentCourseModel.getLessonNotes(studentId, lessonId);
};

export const saveLessonNote = async (studentId, lessonId, payload) => {
  return studentCourseModel.saveLessonNote(
    studentId,
    lessonId,
    payload?.note,
    payload?.timestampSeconds ?? null,
    payload?.noteId ?? null,
  );
};

export const deleteLessonNote = async (studentId, lessonId, noteId) => {
  return studentCourseModel.deleteLessonNote(studentId, lessonId, noteId);
};

export const createResourceDownloadUrl = async (studentId, resourceId) => {
  return studentCourseModel.createResourceDownloadUrl(studentId, resourceId);
};

export const resolveResourceDownload = async (resourceId, studentId, expires, signature) => {
  return studentCourseModel.resolveResourceDownload(resourceId, studentId, expires, signature);
};

export default {
  listCourses,
  getCourse,
  getLesson,
  saveWatchProgress,
  updateLessonProgress,
  getLessonNotes,
  saveLessonNote,
  deleteLessonNote,
  createResourceDownloadUrl,
  resolveResourceDownload,
};
