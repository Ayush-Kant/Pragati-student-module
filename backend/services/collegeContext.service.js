import { resolveUserIntId } from '../utils/userResolver.js';
import { findCollegeIdByUserId, findCollegeIdByEmail, findSingleCollegeId } from '../models/collegeContext.model.js';

/** Resolves the authenticated JWT subject to its college profile id. */
export const resolveCollegeId = async (user = {}) => {
  const candidateIds = [];

  if (user.userId) {
    const internalUserId = await resolveUserIntId(user.userId);
    if (internalUserId) candidateIds.push(internalUserId);
  }

  if (user.uid && !candidateIds.includes(Number(user.uid))) {
    candidateIds.push(Number(user.uid));
  }

  if (user.id && !candidateIds.includes(Number(user.id))) {
    candidateIds.push(Number(user.id));
  }

  if (user.authUserId && !candidateIds.includes(Number(user.authUserId))) {
    candidateIds.push(Number(user.authUserId));
  }

  for (const candidateId of candidateIds) {
    const collegeId = await findCollegeIdByUserId(candidateId);
    if (collegeId) return collegeId;
  }

  if (user.email) {
    const collegeIdByEmail = await findCollegeIdByEmail(user.email);
    if (collegeIdByEmail) return collegeIdByEmail;
  }

  const singleCollegeId = await findSingleCollegeId();
  if (singleCollegeId) return singleCollegeId;

  return null;
};
