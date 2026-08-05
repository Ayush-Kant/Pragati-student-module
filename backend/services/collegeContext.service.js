import { resolveUserIntId } from '../utils/userResolver.js';
import { findCollegeIdByUserId } from '../models/collegeContext.model.js';

/** Resolves the authenticated JWT subject to its college profile id. */
export const resolveCollegeId = async (user = {}) => {
  const internalUserId = await resolveUserIntId(user.userId || user.id);
  return internalUserId ? findCollegeIdByUserId(internalUserId) : null;
};
