import {
  getShortlistedStudentsService,
  getCompanyShortlistService,
  updateShortlistService,
  removeShortlistedStudentService,
} from '../services/collegeShortlists.service.js'
import { validateShortlistUpdate } from '../validators/collegeShortlists.validator.js'
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js'

export const getShortlists = async (req, res, next) => {
  try {
    const { shortlists, pagination } = await getShortlistedStudentsService(req.query)
    return paginatedResponse(res, shortlists, pagination, 'Shortlists fetched successfully')
  } catch (err) {
    next(err)
  }
}

export const getCompanyShortlist = async (req, res, next) => {
  try {
    const { shortlists, pagination } = await getCompanyShortlistService(req.params.companyId, req.query)
    return paginatedResponse(res, shortlists, pagination, 'Company shortlist fetched successfully')
  } catch (err) {
    next(err)
  }
}

export const updateShortlist = async (req, res, next) => {
  try {
    const { isValid, errors } = validateShortlistUpdate(req.body)
    if (!isValid) return errorResponse(res, 'Validation failed', 400, errors)

    const updated = await updateShortlistService(req.params.id, req.body)
    return successResponse(res, updated, 'Shortlist updated successfully')
  } catch (err) {
    next(err)
  }
}

export const removeShortlistedStudent = async (req, res, next) => {
  try {
    await removeShortlistedStudentService(req.params.id)
    return successResponse(res, null, 'Student removed from shortlist')
  } catch (err) {
    next(err)
  }
}