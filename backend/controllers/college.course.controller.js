import * as courseService from "../services/college.course.service.js";

/**
 * Location: backend/controllers/college.course.controller.js
 */

export const getCourses = async (req, res, next) => {
  try {
    const { page, pageSize, departmentId, semester } = req.query;
    const result = await courseService.getCourses({ page, pageSize, departmentId, semester });
    res.status(200).json({ success: true, data: result.courses, meta: result.meta });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourse(req.params.id);
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.addCourse(req.body);
    res.status(201).json({ success: true, message: "Course created successfully.", data: course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.editCourse(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Course updated successfully.", data: course });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const result = await courseService.removeCourse(req.params.id);
    res.status(200).json({ success: true, message: "Course deleted successfully.", data: result });
  } catch (err) {
    next(err);
  }
};

export const getCoursesByDepartment = async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;
    const result = await courseService.getDepartmentCourses(req.params.id, { page, pageSize });
    res.status(200).json({ success: true, data: result.courses, meta: { department: result.department } });
  } catch (err) {
    next(err);
  }
};

export default {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByDepartment,
};