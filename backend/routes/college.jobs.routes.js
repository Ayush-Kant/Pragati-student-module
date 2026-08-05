import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

import * as controller from '../controllers/college.jobs.controller.js';
import * as validator from '../validators/college.jobs.validator.js';

const router = express.Router();

router.use(
    authMiddleware,
    roleMiddleware('college')
);

/* ===================================
   Company APIs
=================================== */

// GET Companies
router.get(
    '/companies',
    controller.getCompanies
);

// GET Company By ID
router.get(
    '/companies/:id',
    controller.getCompanyById
);

// CREATE Company
router.post(
    '/companies',
    controller.createCompany
);

// UPDATE Company
router.put(
    '/companies/:id',
    controller.updateCompany
);

// DELETE Company
router.delete(
    '/companies/:id',
    controller.deleteCompany
);

/* ===================================
   Jobs APIs
=================================== */

// GET All Jobs
router.get(
    '/',
    controller.getAllJobs
);

// CREATE Job
router.post(
    '/',
    validator.sanitizeInput,
    validator.validateRequestBody,
    validator.validateCreateJob,
    controller.createJob
);

/* ===================================
   Job Posting APIs
=================================== */

// GET All Job Postings
router.get(
    '/postings',
    controller.getJobPostings
);

// GET Job Posting By ID
router.get(
    '/postings/:id',
    validator.validateJobId,
    controller.getJobPostingById
);

// CREATE Job Posting
router.post(
    '/postings',
    validator.sanitizeInput,
    validator.validateRequestBody,
    validator.validateJobPosting,
    controller.createJobPosting
);

// UPDATE Job Posting
router.put(
    '/postings/:id',
    validator.sanitizeInput,
    validator.validateRequestBody,
    validator.validateJobPosting,
    controller.updateJobPosting
);

// DELETE Job Posting
router.delete(
    '/postings/:id',
    validator.validateJobId,
    controller.deleteJobPosting
);

// Publish Job Posting
router.patch(
    '/postings/:id/publish',
    validator.validateJobId,
    controller.publishJobPosting
);

// Close Job Posting
router.patch(
    '/postings/:id/close',
    validator.validateJobId,
    controller.closeJobPosting
);

/* ===================================
   Eligibility APIs
=================================== */

// GET Eligibility
router.get(
    '/postings/:id/eligibility',
    validator.validateJobId,
    controller.getEligibility
);

// CREATE Eligibility
router.post(
    '/postings/:id/eligibility',
    validator.sanitizeInput,
    validator.validateRequestBody,
    validator.validateEligibility,
    controller.createEligibility
);

// UPDATE Eligibility
router.put(
    '/postings/:id/eligibility',
    validator.sanitizeInput,
    validator.validateRequestBody,
    validator.validateEligibility,
    controller.updateEligibility
);

// DELETE Eligibility
router.delete(
    '/postings/:id/eligibility',
    validator.validateJobId,
    controller.deleteEligibility
);

/* ===================================
   Hiring Rounds APIs
=================================== */

// GET Hiring Rounds
router.get(
    '/postings/:id/rounds',
    validator.validateJobId,
    controller.getRounds
);

// CREATE Hiring Round
router.post(
    '/postings/:id/rounds',
    validator.validateJobId,
    controller.createRound
);


// UPDATE Hiring Round
router.put(
    '/postings/:id/rounds/:roundId',
    validator.validateJobId,
    controller.updateRound
);


// DELETE Hiring Round
router.delete(
    '/postings/:id/rounds/:roundId',
    validator.validateJobId,
    controller.deleteRound
);



/* ===================================
   Jobs APIs (Keep Dynamic Routes LAST)
=================================== */

// GET Job By ID
router.get(
    '/:id',
    validator.validateJobId,
    controller.getJobById
);

export default router;