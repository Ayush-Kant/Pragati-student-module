import {
  getStudentsService,
  nominateStudentService,
  updateNominationService,
  removeNominationService,
  getNominatedStudentsService,
} from '../services/collegeNominations.service.js'
import { validateNomination, validateNominationUpdate } from '../validators/collegeNominations.validator.js'
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js'

export const getNominations = async (req, res, next) => {
  try {
    const { nominations, pagination } = await getStudentsService(req.query)
    return paginatedResponse(res, nominations, pagination, 'Nominations fetched successfully')
  } catch (err) {
    next(err)
  }
}

export const nominateStudent = async (req, res, next) => {
  try {
    const { isValid, errors } = validateNomination(req.body)
    if (!isValid) return errorResponse(res, 'Validation failed', 400, errors)

    const nomination = await nominateStudentService({
      ...req.body,
      nominated_by: req.user?.id,
    })
    return successResponse(res, nomination, 'Student nominated successfully', 201)
  } catch (err) {
    next(err)
  }
}

export const updateNomination = async (req, res, next) => {
  try {
    const { isValid, errors } = validateNominationUpdate(req.body)
    if (!isValid) return errorResponse(res, 'Validation failed', 400, errors)

    const updated = await updateNominationService(req.params.id, req.body)
    return successResponse(res, updated, 'Nomination updated successfully')
  } catch (err) {
    next(err)
  }
}

export const removeNomination = async (req, res, next) => {
  try {
    await removeNominationService(req.params.id)
    return successResponse(res, null, 'Nomination removed successfully')
  } catch (err) {
    next(err)
  }
}

export const getNominatedStudents = async (req, res, next) => {
  try {
    const students = await getNominatedStudentsService(req.params.companyId)
    return successResponse(res, students, 'Nominated students fetched successfully')
  } catch (err) {
    next(err)
  }
}