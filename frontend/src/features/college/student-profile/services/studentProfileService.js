import {
  studentProfile,
  academicPerformance,
  placementHistory
} from "../types/studentProfileDummyData";

export const getStudentProfile = async (studentId) => {
  console.log("Returning dummy data studentProfile directly");
  return studentProfile;
};

export const getAcademicPerformance = async (studentId) => {
  console.log("Returning dummy data academicPerformance directly");
  return academicPerformance;
};

export const getPlacementHistory = async (studentId) => {
  console.log("Returning dummy data placementHistory directly");
  return placementHistory;
};

export const getSkills = async (studentId) => {
  return studentProfile.skills;
};

export const getCertifications = async (studentId) => {
  return studentProfile.certifications;
};
