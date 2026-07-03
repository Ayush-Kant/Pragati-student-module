import { pool } from "../config/db.js";

class SkillsModel {
  async getStudentSkills(studentId) {
    const query = `SELECT * FROM student_skills WHERE student_id = $1 ORDER BY created_at DESC;`;
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  async addStudentSkill(studentId, skillData) {
    const { skill_name, skill_level, category } = skillData;
    const query = `
      INSERT INTO student_skills (student_id, skill_name, skill_level, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [studentId, skill_name, skill_level, category]);
    return result.rows[0];
  }

  async updateStudentSkill(studentId, skillId, skillData) {
    const fields = [];
    const values = [];
    let queryIdx = 1;

    for (const [key, value] of Object.entries(skillData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${queryIdx}`);
        values.push(value);
        queryIdx++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    values.push(studentId);
    values.push(skillId);

    const query = `
      UPDATE student_skills 
      SET ${fields.join(", ")}
      WHERE student_id = $${queryIdx} AND id = $${queryIdx + 1}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteStudentSkill(studentId, skillId) {
    const query = `
      DELETE FROM student_skills 
      WHERE student_id = $1 AND id = $2 
      RETURNING id;
    `;
    const result = await pool.query(query, [studentId, skillId]);
    return result.rows[0];
  }
}

export default new SkillsModel();
