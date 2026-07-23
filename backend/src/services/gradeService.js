import * as gradeModel from "../models/gradeModel.js";
import { createError } from "../utils/assignmentHelpers.js";

export const getGrades = async (studentId) => {
  const grades = await gradeModel.getGrades(studentId);
  return grades;
};

export const updateGrades = async (assignmentId, studentId, payload) => {
  if (!assignmentId) {
    throw createError("Assignment id is required", 400);
  }

  const grade = await gradeModel.updateGrades(assignmentId, studentId, payload);
  if (!grade) {
    throw createError("Grade could not be updated", 500);
  }
  return grade;
};

export default {
  getGrades,
  updateGrades,
};
