import {
  getEligibleStudentsService,
  checkEligibilityService,
  getEligibleDepartmentsService,
  getEligibleBatchesService,
} from '../services/collegeEligibilities.service.js'
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js'

export const getEligibleStudents = async (req, res, next) => {
  try {
    const { students, pagination } = await getEligibleStudentsService(req.query)
    return paginatedResponse(res, students, pagination, 'Eligible students fetched successfully')
  } catch (err) {
    next(err)
  }
}

export const checkEligibility = async (req, res, next) => {
  try {
    const student = await checkEligibilityService(req.params.studentId)
    if (!student) return errorResponse(res, 'Student is not eligible', 400)
    return successResponse(res, student, 'Student is eligible')
  } catch (err) {
    next(err)
  }
}

export const getEligibleDepartments = async (req, res, next) => {
  try {
    const departments = await getEligibleDepartmentsService()
    return successResponse(res, departments, 'Departments fetched successfully')
  } catch (err) {
    next(err)
  }
}

export const getEligibleBatches = async (req, res, next) => {
  try {
    const batches = await getEligibleBatchesService()
    return successResponse(res, batches, 'Batches fetched successfully')
  } catch (err) {
    next(err)
  }
}