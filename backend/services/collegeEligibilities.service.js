import {
  getEligibleStudents,
  checkEligibility,
  getEligibleDepartments,
  getEligibleBatches,
} from '../models/collegeEligibilities.model.js'
import { getPagination, getPaginationMeta } from '../utils/pagination.js'

export const getEligibleStudentsService = async (query) => {
  const { page, limit, offset } = getPagination(query)
  const { department, batch } = query
  const { rows, total } = await getEligibleStudents({ department, batch, limit, offset })
  return {
    students: rows,
    pagination: getPaginationMeta(total, page, limit),
  }
}

export const checkEligibilityService = async (studentId) => {
  return await checkEligibility(studentId)
}

export const getEligibleDepartmentsService = async () => {
  return await getEligibleDepartments()
}

export const getEligibleBatchesService = async () => {
  return await getEligibleBatches()
}