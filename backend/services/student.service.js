import * as StudentModel from '../models/studentModel.js';
import { sanitizeInput } from '../validators/student.validator.js';

// ─── Get all students ─────────────────────────────────────────────────────────
export const getStudents = async (filters = {}, pagination = {}) => {
  const { students, total, page, pageSize } = await StudentModel.getAllStudents(filters, pagination);
  return {
    success:    true,
    data:       students,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
};

// ─── Get single student ───────────────────────────────────────────────────────
export const getStudent = async (id) => {
  const student = await StudentModel.getStudentById(id);
  if (!student) return { success: false, message: 'Student not found' };
  return { success: true, data: student };
};

// ─── Add new student ──────────────────────────────────────────────────────────
export const addStudent = async (rawData) => {
  const data   = sanitizeInput(rawData);
  const skills = Array.isArray(data.skills) ? data.skills : [];

  // Check duplicates
  const duplicate = await StudentModel.checkDuplicate(data.enrollmentNo, data.email);
  if (duplicate) {
    return { success: false, message: 'A student with this enrollment number or email already exists' };
  }

  const student = await StudentModel.createStudent(data, skills);
  return { success: true, data: student, message: 'Student created successfully' };
};

// ─── Edit student ─────────────────────────────────────────────────────────────
export const editStudent = async (id, rawData) => {
  const data   = sanitizeInput(rawData);
  const skills = data.skills !== undefined ? (Array.isArray(data.skills) ? data.skills : []) : undefined;

  // Check duplicates (excluding self)
  if (data.enrollmentNo || data.email) {
    const duplicate = await StudentModel.checkDuplicate(
      data.enrollmentNo || '', data.email || '', id
    );
    if (duplicate) {
      return { success: false, message: 'A student with this enrollment number or email already exists' };
    }
  }

  const student = await StudentModel.updateStudent(id, data, skills);
  if (!student) return { success: false, message: 'Student not found' };
  return { success: true, data: student, message: 'Student updated successfully' };
};

// ─── Remove student ───────────────────────────────────────────────────────────
export const removeStudent = async (id) => {
  const deleted = await StudentModel.deleteStudent(id);
  if (!deleted) return { success: false, message: 'Student not found' };
  return { success: true, message: 'Student deleted successfully' };
};

// ─── Search students ──────────────────────────────────────────────────────────
export const searchStudents = async (query, options = {}) => {
  const { page, pageSize, ...extraFilters } = options;
  return getStudents({ search: query, ...extraFilters }, { page, pageSize });
};

// ─── Filter students ──────────────────────────────────────────────────────────
export const filterStudents = async (filters, pagination = {}) => {
  return getStudents(filters, pagination);
};

// ─── Get student statistics ───────────────────────────────────────────────────
export const getStatistics = async (college = null, collegeId = null) => {
  const stats = await StudentModel.getStudentStatistics(college, collegeId);
  return { success: true, data: stats };
};

// ─── Academic details ─────────────────────────────────────────────────────────
export const getAcademicDetails = async (studentId) => {
  const exists = await StudentModel.getStudentById(studentId);
  if (!exists) return { success: false, message: 'Student not found' };

  const academic = await StudentModel.getAcademicDetails(studentId);
  return { success: true, data: academic };
};

export const updateAcademicDetails = async (studentId, data) => {
  const exists = await StudentModel.getStudentById(studentId);
  if (!exists) return { success: false, message: 'Student not found' };

  const academic = await StudentModel.upsertAcademicDetails(studentId, data);
  return { success: true, data: academic, message: 'Academic details updated' };
};

// ─── Skills ───────────────────────────────────────────────────────────────────
export const getStudentSkills = async (studentId) => {
  const exists = await StudentModel.getStudentById(studentId);
  if (!exists) return { success: false, message: 'Student not found' };

  const skills = await StudentModel.getStudentSkills(studentId);
  return { success: true, data: skills };
};

export const addStudentSkill = async (studentId, skillName) => {
  const exists = await StudentModel.getStudentById(studentId);
  if (!exists) return { success: false, message: 'Student not found' };

  const skill = await StudentModel.addStudentSkill(studentId, skillName);
  return { success: true, data: skill, message: 'Skill added successfully' };
};

export const deleteStudentSkill = async (studentId, skillId) => {
  const deleted = await StudentModel.deleteStudentSkill(studentId, skillId);
  if (!deleted) return { success: false, message: 'Skill not found' };
  return { success: true, message: 'Skill deleted successfully' };
};
