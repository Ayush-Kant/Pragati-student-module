import * as courseModel from "../models/college.course.models.js";
import * as departmentModel from "../models/college.department.models.js";
import * as statsModel from "../models/college.departmentstatistics.models.js";

/**
 * Location: backend/services/college.course.service.js
 */

const formatCourse = (row) => ({
  id: row.id,
  courseName: row.course_name,
  courseCode: row.course_code,
  semester: row.semester,
  credits: row.credits,
  departmentId: row.department_id,
  departmentName: row.department_name,
  departmentCode: row.department_code,
  description: row.description,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getCourses = async ({ page = 1, pageSize = 20, departmentId, semester } = {}) => {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const filters = {};
  if (departmentId) filters.departmentId = Number(departmentId);
  if (semester) filters.semester = Number(semester);

  const [rows, total] = await Promise.all([
    courseModel.getAllCourses({ ...filters, limit, offset }),
    courseModel.countCourses(filters),
  ]);

  return {
    courses: rows.map(formatCourse),
    meta: {
      page: Math.max(Number(page) || 1, 1),
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getCourse = async (id) => {
  const course = await courseModel.getCourseById(id);
  if (!course) {
    const err = new Error(`Course with id ${id} was not found.`);
    err.statusCode = 404;
    throw err;
  }
  return formatCourse(course);
};

export const addCourse = async (payload) => {
  const { courseName, courseCode, semester, credits, departmentId, description } = payload;
  const normalizedCode = courseCode.trim().toUpperCase();

  const department = await departmentModel.getDepartmentById(departmentId);
  if (!department) {
    const err = new Error(`Department with id ${departmentId} does not exist.`);
    err.statusCode = 400;
    throw err;
  }

  const existingByCode = await courseModel.getCourseByCode(normalizedCode);
  if (existingByCode) {
    const err = new Error(`Course code "${normalizedCode}" is already in use.`);
    err.statusCode = 409;
    throw err;
  }

  const created = await courseModel.createCourse({
    courseName: courseName.trim(),
    courseCode: normalizedCode,
    semester: Number(semester),
    credits: Number(credits),
    departmentId: Number(departmentId),
    description,
  });

  await statsModel.recomputeDepartmentStatistics(departmentId);

  const full = await courseModel.getCourseById(created.id);
  return formatCourse(full);
};

export const editCourse = async (id, payload) => {
  const existing = await courseModel.getCourseById(id);
  if (!existing) {
    const err = new Error(`Course with id ${id} was not found.`);
    err.statusCode = 404;
    throw err;
  }

  const fields = {};
  if (payload.courseName !== undefined) fields.courseName = payload.courseName.trim();
  if (payload.courseCode !== undefined) fields.courseCode = payload.courseCode.trim().toUpperCase();
  if (payload.semester !== undefined) fields.semester = Number(payload.semester);
  if (payload.credits !== undefined) fields.credits = Number(payload.credits);
  if (payload.departmentId !== undefined) fields.departmentId = Number(payload.departmentId);
  if (payload.description !== undefined) fields.description = payload.description;
  if (payload.isActive !== undefined) fields.isActive = payload.isActive;

  if (fields.courseCode && fields.courseCode !== existing.course_code) {
    const owner = await courseModel.getCourseByCode(fields.courseCode);
    if (owner && owner.id !== Number(id)) {
      const err = new Error(`Course code "${fields.courseCode}" is already in use.`);
      err.statusCode = 409;
      throw err;
    }
  }

  let newDepartmentId = null;
  if (fields.departmentId && fields.departmentId !== existing.department_id) {
    const department = await departmentModel.getDepartmentById(fields.departmentId);
    if (!department) {
      const err = new Error(`Department with id ${fields.departmentId} does not exist.`);
      err.statusCode = 400;
      throw err;
    }
    newDepartmentId = fields.departmentId;
  }

  await courseModel.updateCourse(id, fields);

  if (newDepartmentId) {
    await Promise.all([
      statsModel.recomputeDepartmentStatistics(existing.department_id),
      statsModel.recomputeDepartmentStatistics(newDepartmentId),
    ]);
  } else if (fields.credits !== undefined || fields.isActive !== undefined) {
    await statsModel.recomputeDepartmentStatistics(existing.department_id);
  }

  const full = await courseModel.getCourseById(id);
  return formatCourse(full);
};

export const removeCourse = async (id) => {
  const existing = await courseModel.getCourseById(id);
  if (!existing) {
    const err = new Error(`Course with id ${id} was not found.`);
    err.statusCode = 404;
    throw err;
  }
  await courseModel.deleteCourse(id);
  await statsModel.recomputeDepartmentStatistics(existing.department_id);
  return { id: Number(id) };
};

export const getDepartmentCourses = async (departmentId, { page = 1, pageSize = 50 } = {}) => {
  const department = await departmentModel.getDepartmentById(departmentId);
  if (!department) {
    const err = new Error(`Department with id ${departmentId} was not found.`);
    err.statusCode = 404;
    throw err;
  }

  const limit = Math.min(Math.max(Number(pageSize) || 50, 1), 200);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const rows = await courseModel.getCoursesByDepartment(departmentId, { limit, offset });
  return {
    department: { id: department.id, name: department.name, code: department.code },
    courses: rows.map(formatCourse),
  };
};

export default {
  getCourses,
  getCourse,
  addCourse,
  editCourse,
  removeCourse,
  getDepartmentCourses,
};