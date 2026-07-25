import * as departmentModel from "../models/college.department.models.js";
import * as statsModel from "../models/college.departmentstatistics.models.js";

/**
 * Location: backend/services/college.department.service.js
 */

const formatDepartment = (row) => ({
  id: row.id,
  name: row.name,
  code: row.code,
  hod: row.hod,
  description: row.description,

  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,

  // Statistics
  totalStudents: Number(row.total_students ?? 0),
  totalCourses: Number(row.total_courses ?? 0),
  totalFaculty: Number(row.total_faculty ?? 0),
  averageCredits: Number(row.average_credits ?? 0),
});

export const getDepartments = async ({
  page = 1,
  pageSize = 20,
  activeOnly = false,
} = {}) => {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const [rows, total] = await Promise.all([
    departmentModel.getAllDepartments({
      limit,
      offset,
      activeOnly,
    }),
    departmentModel.countDepartments({
      activeOnly,
    }),
  ]);

  return {
    departments: rows.map(formatDepartment),
    meta: {
      page: Math.max(Number(page) || 1, 1),
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getDepartment = async (id) => {
  const department = await departmentModel.getDepartmentById(id);

  if (!department) {
    const err = new Error(`Department with id ${id} was not found.`);
    err.statusCode = 404;
    throw err;
  }

  return formatDepartment(department);
};

export const addDepartment = async (payload) => {
  const { name, code, hod, description } = payload;

  const normalizedCode = code.trim().toUpperCase();

  const [existingByCode, existingByName] = await Promise.all([
    departmentModel.getDepartmentByCode(normalizedCode),
    departmentModel.getDepartmentByName(name.trim()),
  ]);

  if (existingByCode) {
    const err = new Error(
      `Department code "${normalizedCode}" is already in use.`
    );
    err.statusCode = 409;
    throw err;
  }

  if (existingByName) {
    const err = new Error(
      `Department name "${name}" is already in use.`
    );
    err.statusCode = 409;
    throw err;
  }

  const created = await departmentModel.createDepartment({
    name: name.trim(),
    code: normalizedCode,
    hod,
    description,
  });

  // Create statistics row
  await statsModel.recomputeDepartmentStatistics(created.id);

  // Fetch updated department including statistics
  const department = await departmentModel.getDepartmentById(created.id);

  return formatDepartment(department);
};

export const editDepartment = async (id, payload) => {
  const existing = await departmentModel.getDepartmentById(id);

  if (!existing) {
    const err = new Error(`Department with id ${id} was not found.`);
    err.statusCode = 404;
    throw err;
  }

  const fields = {};

  if (payload.name !== undefined)
    fields.name = payload.name.trim();

  if (payload.code !== undefined)
    fields.code = payload.code.trim().toUpperCase();

  if (payload.hod !== undefined)
    fields.hod = payload.hod;

  if (payload.description !== undefined)
    fields.description = payload.description;

  if (payload.isActive !== undefined)
    fields.is_active = payload.isActive;

  if (fields.code && fields.code !== existing.code) {
    const owner = await departmentModel.getDepartmentByCode(fields.code);

    if (owner && owner.id !== Number(id)) {
      const err = new Error(
        `Department code "${fields.code}" is already in use.`
      );
      err.statusCode = 409;
      throw err;
    }
  }

  if (fields.name && fields.name !== existing.name) {
    const owner = await departmentModel.getDepartmentByName(fields.name);

    if (owner && owner.id !== Number(id)) {
      const err = new Error(
        `Department name "${fields.name}" is already in use.`
      );
      err.statusCode = 409;
      throw err;
    }
  }

  await departmentModel.updateDepartment(id, fields);

  // Recompute statistics after update
  await statsModel.recomputeDepartmentStatistics(id);

  // Return updated department with statistics
  const updated = await departmentModel.getDepartmentById(id);

  return formatDepartment(updated);
};

export const removeDepartment = async (id) => {
  const existing = await departmentModel.getDepartmentById(id);

  if (!existing) {
    const err = new Error(`Department with id ${id} was not found.`);
    err.statusCode = 404;
    throw err;
  }

  await departmentModel.deleteDepartment(id);

  return {
    id: Number(id),
  };
};

export const searchDepartments = async (
  searchTerm,
  {
    page = 1,
    pageSize = 20,
  } = {}
) => {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);

  const offset =
    (Math.max(Number(page) || 1, 1) - 1) * limit;

  const rows = await departmentModel.searchDepartments(
    searchTerm.trim(),
    {
      limit,
      offset,
    }
  );

  return rows.map(formatDepartment);
};

export default {
  getDepartments,
  getDepartment,
  addDepartment,
  editDepartment,
  removeDepartment,
  searchDepartments,
};