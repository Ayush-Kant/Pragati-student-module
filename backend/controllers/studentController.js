import { pool } from "../config/db.js";

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