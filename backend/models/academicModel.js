import { pool } from "../config/db.js";

class AcademicModel {
  async getAcademicDetails(studentId) {
    const query = `SELECT * FROM student_academic_details WHERE student_id = $1;`;
    const result = await pool.query(query, [studentId]);
    return result.rows[0];
  }

  async updateAcademicDetails(studentId, academicData) {
    const checkQuery = `SELECT id FROM student_academic_details WHERE student_id = $1;`;
    const checkResult = await pool.query(checkQuery, [studentId]);

    if (checkResult.rowCount === 0) {
      const fields = ['student_id'];
      const values = [studentId];
      const placeholders = ['$1'];
      let queryIdx = 2;

      for (const [key, value] of Object.entries(academicData)) {
        if (value !== undefined) {
          fields.push(key);
          values.push(value);
          placeholders.push(`$${queryIdx}`);
          queryIdx++;
        }
      }

      const insertQuery = `
        INSERT INTO student_academic_details (${fields.join(", ")})
        VALUES (${placeholders.join(", ")})
        RETURNING *;
      `;
      const result = await pool.query(insertQuery, values);
      return result.rows[0];
    } else {
      const fields = [];
      const values = [];
      let queryIdx = 1;

      for (const [key, value] of Object.entries(academicData)) {
        if (value !== undefined) {
          fields.push(`${key} = $${queryIdx}`);
          values.push(value);
          queryIdx++;
        }
      }

      if (fields.length === 0) return this.getAcademicDetails(studentId);

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(studentId);

      const updateQuery = `
        UPDATE student_academic_details 
        SET ${fields.join(", ")}
        WHERE student_id = $${queryIdx}
        RETURNING *;
      `;
      const result = await pool.query(updateQuery, values);
      return result.rows[0];
    }
  }
}

export default new AcademicModel();
