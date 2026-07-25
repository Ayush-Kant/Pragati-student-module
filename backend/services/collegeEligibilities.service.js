import {
  getEligibleStudents,
  checkEligibility,
  getEligibleDepartments,
  getEligibleBatches,
} from '../models/collegeEligibilities.model.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

// collegeId is forwarded from the JWT so each college only sees its own students
export const getEligibleStudentsService = async (query, collegeId = null) => {
  const { page, limit, offset } = getPagination(query);
  const { department, batch } = query;
  const { rows, total } = await getEligibleStudents({
    department,
    batch,
    collegeId,
    limit,
    offset,
  });
  return {
    students: rows,
    pagination: getPaginationMeta(total, page, limit),
  };
};

export const checkEligibilityService = async (studentId) => {
  return await checkEligibility(studentId);
};

export const getEligibleDepartmentsService = async (collegeId = null) => {
  return await getEligibleDepartments(collegeId);
};

export const getEligibleBatchesService = async (collegeId = null) => {
  return await getEligibleBatches(collegeId);
};

// createEligibleStudentService intentionally removed —
// eligible_students is now a view; students auto-appear when added to students table.
