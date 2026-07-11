import express from 'express'
import {
  getNominations,
  nominateStudent,
  updateNomination,
  removeNomination,
  getNominatedStudents,
} from '../controllers/collegeNominations.controller.js'
import {
  getShortlists,
  getCompanyShortlist,
  updateShortlist,
  removeShortlistedStudent,
} from '../controllers/collegeShortlists.controller.js'
import {
  getEligibleStudents,
  checkEligibility,
  getEligibleDepartments,
  getEligibleBatches,
} from '../controllers/collegeEligibilities.controller.js'
import {
  getNominationStatistics,
  getCompanyStatistics,
  getDepartmentStatistics,
} from '../controllers/collegeNominationStatistics.controller.js'
import { sanitizeInput } from '../validators/collegeRequests.validator.js'

const router = express.Router()

// Apply sanitization to all routes
router.use(sanitizeInput)

// Eligibility Routes
router.get('/nominations/eligible', getEligibleStudents)
router.get('/nominations/eligible/departments', getEligibleDepartments)
router.get('/nominations/eligible/batches', getEligibleBatches)
router.get('/nominations/eligible/:studentId', checkEligibility)

// Nomination Routes
router.get('/nominations', getNominations)
router.post('/nominations', nominateStudent)
router.put('/nominations/:id', updateNomination)
router.delete('/nominations/:id', removeNomination)
router.get('/nominations/company/:companyId', getNominatedStudents)

// Statistics Routes
router.get('/nominations/statistics', getNominationStatistics)
router.get('/nominations/company-statistics', getCompanyStatistics)
router.get('/nominations/department-statistics', getDepartmentStatistics)

// Shortlist Routes
router.get('/shortlists', getShortlists)
router.get('/shortlists/company/:companyId', getCompanyShortlist)
router.put('/shortlists/:id', updateShortlist)
router.delete('/shortlists/:id', removeShortlistedStudent)

export default router