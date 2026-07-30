import {
  getEligibleForDriveService,
  getDriveNomineesService,
  setEligibilityService,
  getDriveNominationsService,
  nominateStudentsService,
  shortlistStudentsService,
} from '../services/driveNominations.service.js';
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from '../utils/responseHandler.js';

// GET /api/placement-drives/:id/eligible
export const getEligibleStudents = async (req, res, next) => {
  try {
    // For college-role users, scope results to their own college
    const collegeId = req.user?.role === 'college' ? (req.user?.collegeId ?? null) : null;
    const students = await getEligibleForDriveService(req.params.id, collegeId);
    return successResponse(res, students, 'Eligible students fetched successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/placement-drives/:id/nominees
export const getNominees = async (req, res, next) => {
  try {
    const nominees = await getDriveNomineesService(req.params.id);
    return successResponse(res, nominees, 'Drive nominees fetched successfully');
  } catch (err) {
    next(err);
  }
};

// PUT /api/placement-drives/:id/eligibility/:sid
// Body: { approved: true | false }
export const setStudentEligibility = async (req, res, next) => {
  try {
    const { id: driveId, sid: studentId } = req.params;
    const { approved } = req.body;

    if (approved === undefined || approved === null) {
      return errorResponse(res, '"approved" field (true/false) is required', 400);
    }

    const userId = req.user?.authUserId || req.user?.id || null;
    const result = await setEligibilityService(driveId, studentId, Boolean(approved), userId);
    return successResponse(res, result, `Student eligibility ${approved ? 'approved' : 'rejected'}`);
  } catch (err) {
    next(err);
  }
};

// GET /api/placement-drives/:id/nominations
export const getDriveNominations = async (req, res, next) => {
  try {
    const { nominations, pagination } = await getDriveNominationsService(
      req.params.id,
      req.query
    );
    return paginatedResponse(res, nominations, pagination, 'Drive nominations fetched successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/placement-drives/:id/nominate
// Body: { studentIds: number[] }
export const nominateStudents = async (req, res, next) => {
  console.log('🔥 NOMINATE REQUEST RECEIVED:', req.params.id, req.body?.studentIds, req.user?.authUserId);
  try {
    const driveId = req.params.id;
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return errorResponse(res, 'studentIds must be a non-empty array', 400);
    }

    const nominatedBy = req.user?.authUserId || req.user?.id || null;
    const result = await nominateStudentsService(driveId, studentIds, nominatedBy);

    return successResponse(
      res,
      {
        nominated: result.inserted.length,
        skipped: result.skipped.length,
        details: result,
      },
      `${result.inserted.length} student(s) nominated successfully`,
      201
    );
  } catch (err) {
    next(err);
  }
};

// PUT /api/placement-drives/:id/shortlist
// Body: { studentIds: number[] }
export const shortlistStudents = async (req, res, next) => {
  try {
    const driveId = req.params.id;
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return errorResponse(res, 'studentIds must be a non-empty array', 400);
    }

    const shortlistedBy = req.user?.authUserId || req.user?.id || null;
    const result = await shortlistStudentsService(driveId, studentIds, shortlistedBy);

    return successResponse(
      res,
      {
        shortlisted: result.shortlisted.length,
        skipped: result.skipped.length,
        details: result,
      },
      `${result.shortlisted.length} student(s) shortlisted successfully`
    );
  } catch (err) {
    next(err);
  }
};
