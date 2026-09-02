import { pool } from "../config/db.js";
import * as studentProfileModel from "../models/studentProfileModel.js";
import { calculateProfileCompleteness } from "../utils/studentProfileCompleteness.js";

const applyCompleteness = async (profile) => {
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
  return applyCompleteness(profile);
};

export const updateMyProfile = async (studentId, payload) => {
  const profile = await studentProfileModel.updateStudentProfile(studentId, payload);
  return applyCompleteness(profile);
};

export const getProfileCompleteness = async (studentId) => {
  const profile = await studentProfileModel.getStudentProfile(studentId);
  if (!profile) return null;

  const completeness = calculateProfileCompleteness(profile);
  if (profile.profileCompleteness !== completeness) {
    await studentProfileModel.updateProfileCompleteness(studentId, completeness);
  }

  return {
    studentId,
    completeness,
  };
};

export const ensureStudentProfileTransactionContext = async (studentId) => {
  const { rows } = await pool.query("SELECT id FROM students WHERE id = $1 LIMIT 1", [studentId]);
  return rows[0] || null;
};
