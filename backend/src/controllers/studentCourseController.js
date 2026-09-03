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
