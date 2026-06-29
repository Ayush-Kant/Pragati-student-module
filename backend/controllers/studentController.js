import { pool } from "../config/db.js";
import studentService from "../services/studentService.js";

// Existing code for student_profiles
export const getStudentProfile = async (req, res) => {
  try {
    const userId = 1;

    const result = await pool.query(
      "SELECT * FROM student_profiles WHERE user_id = $1",
      [userId]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const userId = 1;

    const {
      name,
      phone,
      city,
      department,
      cgpa,
      skills,
    } = req.body || {};
    let parsedCgpa = cgpa;
    if (cgpa === "") parsedCgpa = null;
    else if (cgpa !== undefined && cgpa !== null) parsedCgpa = Number(cgpa);

    let parsedSkills = skills;
    if (Array.isArray(skills)) {
      parsedSkills = JSON.stringify(skills);
    }

    const result = await pool.query(
      `
      INSERT INTO student_profiles
      (user_id, name, phone, city, department, cgpa, skills)
      VALUES ($1,$2,$3,$4,$5,$6,$7)

      ON CONFLICT (user_id)

      DO UPDATE SET
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      city = EXCLUDED.city,
      department = EXCLUDED.department,
      cgpa = EXCLUDED.cgpa,
      skills = EXCLUDED.skills

      RETURNING *;
      `,
      [userId, name, phone, city, department, parsedCgpa, parsedSkills]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};

// --- New code for Student Database Management Module ---

export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await studentService.getStudents(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const result = await studentService.getStudent(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const result = await studentService.addStudent(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes("already exists")) {
      return res.status(409).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const result = await studentService.editStudent(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes("already exists")) {
      return res.status(409).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const result = await studentService.removeStudent(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    const result = await studentService.searchStudents(q);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const filterStudents = async (req, res) => {
  try {
    const filters = req.query;
    const result = await studentService.filterStudents(filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentStatistics = async (req, res) => {
  try {
    const result = await studentService.getStatistics();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Academic Methods
export const getAcademicDetails = async (req, res) => {
  try {
    const result = await studentService.getAcademicDetails(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Academic details not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAcademicDetails = async (req, res) => {
  try {
    const result = await studentService.updateAcademicDetails(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Skills Methods
export const getStudentSkills = async (req, res) => {
  try {
    const result = await studentService.getStudentSkills(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addStudentSkill = async (req, res) => {
  try {
    const result = await studentService.addStudentSkill(req.params.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Skill already exists for this student") {
      return res.status(409).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudentSkill = async (req, res) => {
  try {
    const result = await studentService.updateStudentSkill(req.params.id, req.params.skillId, req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Skill not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeStudentSkill = async (req, res) => {
  try {
    const result = await studentService.removeStudentSkill(req.params.id, req.params.skillId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Skill not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};