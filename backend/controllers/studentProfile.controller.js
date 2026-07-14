import { pool } from "../config/db.js";

export const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT * FROM student_profile
       WHERE user_id = (
         SELECT users.id FROM users
         INNER JOIN auth_users ON auth_users.id = users.auth_user_id
         WHERE auth_users.uuid_id = $1
       )`,
      [userId]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, city, department, cgpa, skills } = req.body;

    const result = await pool.query(
      `UPDATE student_profile
       SET name=$1, phone=$2, city=$3, department=$4, cgpa=$5, skills=$6
       WHERE user_id = (
         SELECT users.id FROM users
         INNER JOIN auth_users ON auth_users.id = users.auth_user_id
         WHERE auth_users.uuid_id = $7
       )
       RETURNING *`,
      [name, phone, city, department, cgpa, skills, userId]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
