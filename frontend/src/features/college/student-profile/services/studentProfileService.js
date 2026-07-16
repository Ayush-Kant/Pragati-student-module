import {
  studentProfile,
  academicPerformance,
  placementHistory
} from "../types/studentProfileDummyData";

export const getStudentProfile = async (studentId) => {
  return studentProfile;
};

export const getAcademicPerformance = async (studentId) => {
  return academicPerformance;
};

export const getPlacementHistory = async (studentId) => {
  return placementHistory;
};

export const getSkills = async (studentId) => {
  return studentProfile.skills || { technical: [], soft: [] };
};

export const getCertifications = async (studentId) => {
  return studentProfile.certifications || [];
};
