import {
  getShortlistedStudents,
  updateShortlist,
  removeShortlistedStudent,
} from '../models/collegeShortlists.model.js'
import { getPagination, getPaginationMeta } from '../utils/pagination.js'

export const getShortlistedStudentsService = async (query) => {
  const { page, limit, offset } = getPagination(query)
  const { company_id, status } = query
  const { rows, total } = await getShortlistedStudents({ company_id, status, limit, offset })
  return {
    shortlists: rows,
    pagination: getPaginationMeta(total, page, limit),
  }
}

export const getCompanyShortlistService = async (companyId, query) => {
  const { page, limit, offset } = getPagination(query)
  const { rows, total } = await getShortlistedStudents({ company_id: companyId, limit, offset })
  return {
    shortlists: rows,
    pagination: getPaginationMeta(total, page, limit),
  }
}

export const updateShortlistService = async (id, data) => {
  const updated = await updateShortlist(id, data)
  if (!updated) throw new Error('Shortlist entry not found')
  return updated
}

export const removeShortlistedStudentService = async (id) => {
  const removed = await removeShortlistedStudent(id)
  if (!removed) throw new Error('Shortlist entry not found')
  return removed
}