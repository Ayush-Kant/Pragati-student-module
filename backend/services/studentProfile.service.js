import * as studentProfileModel from "../models/studentProfileModel.js";
import { calculateProfileCompleteness } from "../utils/studentProfileCompleteness.js";

const syncCompleteness = async (profile) => {
  if (!profile) return null;

  const completeness = calculateProfileCompleteness(profile);

  if (profile.profileCompleteness !== completeness) {
    await studentProfileModel.updateProfileCompleteness(profile.studentId, completeness);
    profile.profileCompleteness = completeness;
  }

  return profile;
};

export const getMyProfile = async (studentId) => {
  const profile = await studentProfileModel.getStudentProfile(studentId);
  return syncCompleteness(profile);
};

export const updateMyProfile = async (studentId, payload) => {
  const profile = await studentProfileModel.updateStudentProfile(studentId, payload);
  return syncCompleteness(profile);
};

export const getProfileCompleteness = async (studentId) => {
  const profile = await studentProfileModel.getStudentProfile(studentId);
  if (!profile) return null;

  const completeness = calculateProfileCompleteness(profile);

  if (profile.profileCompleteness !== completeness) {
    await studentProfileModel.updateProfileCompleteness(studentId, completeness);
  }

  return { studentId, completeness };
};
