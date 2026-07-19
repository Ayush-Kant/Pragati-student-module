import * as statsModel from "../models/college.departmentstatistics.models.js";
import * as departmentModel from "../models/college.department.models.js";

/**
 * Location: backend/services/college.departmentstatistics.service.js
 */

const formatStatistics = (row) => ({
  departmentId: row.department_id,
  departmentName: row.department_name,
  departmentCode: row.department_code,
  totalCourses: row.total_courses,
  totalStudents: row.total_students,
  totalFaculty: row.total_faculty,
  averageCredits: Number(row.average_credits),
  updatedAt: row.updated_at,
});

export const getStatistics = async (departmentId = null) => {
  if (departmentId) {
    const department = await departmentModel.getDepartmentById(departmentId);
    if (!department) {
      const err = new Error(`Department with id ${departmentId} was not found.`);
      err.statusCode = 404;
      throw err;
    }

    let stats = await statsModel.getDepartmentStatistics(departmentId);
    if (!stats) {
      stats = await statsModel.recomputeDepartmentStatistics(departmentId);
      stats.department_name = department.name;
      stats.department_code = department.code;
    }
    return formatStatistics(stats);
  }

  const rows = await statsModel.getDepartmentStatistics(null);
  return rows.map(formatStatistics);
};

export const updateStatistics = async (payload) => {
  const departmentId = Number(payload.departmentId ?? payload.department_id);

  const department = await departmentModel.getDepartmentById(departmentId);
  if (!department) {
    const err = new Error(`Department with id ${departmentId} was not found.`);
    err.statusCode = 404;
    throw err;
  }

  const { totalStudents, totalFaculty, recompute } = payload;

  let updated;
  if (recompute) {
    updated = await statsModel.recomputeDepartmentStatistics(departmentId);
    if (totalStudents !== undefined || totalFaculty !== undefined) {
      updated = await statsModel.updateDepartmentStatistics(departmentId, { totalStudents, totalFaculty });
    }
  } else {
    updated = await statsModel.updateDepartmentStatistics(departmentId, { totalStudents, totalFaculty });
  }

  updated.department_name = department.name;
  updated.department_code = department.code;
  return formatStatistics(updated);
};

export default { getStatistics, updateStatistics };