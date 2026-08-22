import {
  getAllNominations,
  getNominationById,
  createNomination,
  updateNomination,
  deleteNomination,
  getNominatedStudents,
} from '../models/collegeNominations.model.js'
import { checkEligibility } from '../models/collegeEligibilities.model.js'
import { createShortlist } from '../models/collegeShortlists.model.js'
import { getPagination, getPaginationMeta } from '../utils/pagination.js'

export const getStudentsService = async (query) => {
  const { page, limit, offset } = getPagination(query)
  const { status, company_id } = query
  const { rows, total } = await getAllNominations({ status, company_id, limit, offset })
  return {
    nominations: rows,
    pagination: getPaginationMeta(total, page, limit),
  }
}

export const nominateStudentService = async (data) => {
  const {
    student_id,
    company_id,
    company_name,
    role,
    package: pkg,
    nominated_by,
    remarks
} = data;

  const eligible = await checkEligibility(student_id)
  if (!eligible) throw new Error('Student is not eligible for nomination')

  const nomination = await createNomination({
    student_id,
    company_id,
    company_name,
    role,
    package: pkg,
    nominated_by,
    remarks
});
  return nomination
}

export const updateNominationService = async (id, data) => {
  const nomination = await getNominationById(id)
  if (!nomination) throw new Error('Nomination not found')

  const updated = await updateNomination(id, data)

  if (data.status === 'Approved') {
    await createShortlist({
      nomination_id: id,
      student_id: nomination.student_id,
      company_id: nomination.company_id,
      company_name: nomination.company_name,
      round: 'Initial',
      remarks: data.remarks,
    })
  }

  return updated
}

export const removeNominationService = async (id) => {
  const nomination = await getNominationById(id)
  if (!nomination) throw new Error('Nomination not found')
  return await deleteNomination(id)
}

export const getNominatedStudentsService = async (company_id) => {
  return await getNominatedStudents(company_id)
}