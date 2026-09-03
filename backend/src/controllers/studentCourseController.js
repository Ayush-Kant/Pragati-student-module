import studentCourseService from '../services/studentCourseService.js';
import { normalizeStudentId, normalizeError } from '../utils/assignmentHelpers.js';

const parsePositiveInteger = (value, field) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw normalizeError(`${field} must be a positive integer`, 400);
  }
  return parsed;
};

export const listCourses = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const courses = await studentCourseService.listCourses(studentId);
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const courseId = parsePositiveInteger(req.params.courseId, 'courseId');
    const course = await studentCourseService.getCourse(studentId, courseId);
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const getLesson = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const lessonId = parsePositiveInteger(req.params.lessonId, 'lessonId');
    const lesson = await studentCourseService.getLesson(studentId, lessonId);
    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

export const saveWatchProgress = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const lessonId = parsePositiveInteger(req.params.lessonId, 'lessonId');
    const watchedSeconds = Number(req.body?.watchedSeconds);
    const totalSeconds = Number(req.body?.totalSeconds);

    const progress = await studentCourseService.saveWatchProgress(
      studentId,
      lessonId,
      watchedSeconds,
      totalSeconds,
    );

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLessonProgress = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const courseId = parsePositiveInteger(req.params.courseId, 'courseId');
    const lessonId = parsePositiveInteger(req.params.lessonId, 'lessonId');
    const completed = Boolean(req.body?.completed);

    const progress = await studentCourseService.updateLessonProgress(
      studentId,
      courseId,
      lessonId,
      completed,
    );

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonNotes = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const lessonId = parsePositiveInteger(req.params.lessonId, 'lessonId');
    const notes = await studentCourseService.getLessonNotes(studentId, lessonId);
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

export const saveLessonNote = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const lessonId = parsePositiveInteger(req.params.lessonId, 'lessonId');
    const note = await studentCourseService.saveLessonNote(studentId, lessonId, req.body || {});
    res.status(req.body?.noteId ? 200 : 201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const deleteLessonNote = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const lessonId = parsePositiveInteger(req.params.lessonId, 'lessonId');
    const noteId = parsePositiveInteger(req.params.noteId, 'noteId');
    const result = await studentCourseService.deleteLessonNote(studentId, lessonId, noteId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createResourceDownloadUrl = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const resourceId = parsePositiveInteger(req.params.resourceId, 'resourceId');
    const result = await studentCourseService.createResourceDownloadUrl(studentId, resourceId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const serveResourceFile = async (req, res, next) => {
  try {
    const resourceId = parsePositiveInteger(req.params.resourceId, 'resourceId');
    const studentId = parsePositiveInteger(req.query.student, 'student');
    const expires = Number(req.query.expires);
    const signature = String(req.query.signature || '');
    const fileUrl = await studentCourseService.resolveResourceDownload(
      resourceId,
      studentId,
      expires,
      signature,
    );
    return res.redirect(fileUrl);
  } catch (error) {
    next(error);
  }
};
