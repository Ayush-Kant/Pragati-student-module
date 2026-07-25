import * as DriveNomModel from '../models/driveNominations.model.js';
import * as DriveModel from '../models/placementDriveModel.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const assertDriveExists = async (driveId) => {
  const drive = await DriveModel.getPlacementDriveById(driveId);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }
  return drive;
};

// ─── Get eligible students for a specific drive ───────────────────────────────
// collegeId is optional — when provided only that college's students are shown
export const getEligibleForDriveService = async (driveId, collegeId = null) => {
  await assertDriveExists(driveId);
  return DriveNomModel.getEligibleForDrive(driveId, collegeId);
};

// ─── Get nominees (registered students) for a drive ──────────────────────────
export const getDriveNomineesService = async (driveId) => {
  await assertDriveExists(driveId);
  return DriveNomModel.getDriveNominees(driveId);
};

// ─── Approve or reject a student's eligibility for a drive ───────────────────
export const setEligibilityService = async (driveId, studentId, approved, userId) => {
  await assertDriveExists(driveId);
  return DriveNomModel.setNomineeEligibility(driveId, studentId, approved, userId);
};

// ─── Get all nominations for a drive (paginated) ─────────────────────────────
export const getDriveNominationsService = async (driveId, query) => {
  await assertDriveExists(driveId);
  const { page, limit, offset } = getPagination(query);
  const { status } = query;
  const { rows, total } = await DriveNomModel.getDriveNominations(driveId, {
    status,
    limit,
    offset,
  });
  return {
    nominations: rows,
    pagination: getPaginationMeta(total, page, limit),
  };
};

// ─── Nominate a batch of students to a drive ─────────────────────────────────
export const nominateStudentsService = async (driveId, studentIds, nominatedBy) => {
  await assertDriveExists(driveId);

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    const err = new Error('studentIds must be a non-empty array');
    err.statusCode = 400;
    throw err;
  }

  return DriveNomModel.nominateStudentsToDrive(driveId, studentIds, nominatedBy);
};

// ─── Shortlist a batch of students for a drive ───────────────────────────────
export const shortlistStudentsService = async (driveId, studentIds, shortlistedBy) => {
  await assertDriveExists(driveId);

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    const err = new Error('studentIds must be a non-empty array');
    err.statusCode = 400;
    throw err;
  }

  return DriveNomModel.shortlistStudentsForDrive(driveId, studentIds, shortlistedBy);
};
