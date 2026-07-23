import {
  getEligibleStudentsService,
  checkEligibilityService,
  getEligibleDepartmentsService,
  getEligibleBatchesService,
  createEligibleStudentService,
} from '../services/collegeEligibilities.service.js'
import { validateCreateEligibleStudent } from '../validators/collegeEligibilities.validator.js'
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

export const createEligibleStudent = async (req, res, next) => {
  try {
    const { isValid, errors } = validateCreateEligibleStudent(req.body)
    if (!isValid) return errorResponse(res, 'Validation failed', 400, errors)

    const student = await createEligibleStudentService(req.body)
    return successResponse(res, student, 'Eligible student created successfully', 201)
  } catch (err) {
    // Check for unique constraint violation (e.g. duplicate student_id)
    if (err.code === '23505') {
      return errorResponse(res, 'Student is already in the eligible list', 409)
    }
    next(err)
  }
}