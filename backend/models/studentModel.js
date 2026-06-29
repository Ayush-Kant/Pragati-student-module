import { pool } from "../config/db.js";

class StudentModel {
  async getAllStudents(limit = 10, offset = 0) {
    const query = `
      SELECT * FROM students
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  async getStudentById(id) {
    const query = `SELECT * FROM students WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async createStudent(studentData) {
    const {
      enrollment_no,
      name,
      email,
      phone,
      department,
      course,
      semester,
      cgpa,
      placement_status,
    } = studentData;

    const query = `
      INSERT INTO students (
        enrollment_no, name, email, phone, department, 
        course, semester, cgpa, placement_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      enrollment_no, name, email, phone, department,
      course, semester, cgpa, placement_status,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async updateStudent(id, studentData) {
    const fields = [];
    const values = [];
    let queryIdx = 1;

    for (const [key, value] of Object.entries(studentData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${queryIdx}`);
        values.push(value);
        queryIdx++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE students 
      SET ${fields.join(", ")}
      WHERE id = $${queryIdx}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteStudent(id) {
    const query = `DELETE FROM students WHERE id = $1 RETURNING id;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async searchStudents(searchTerm) {
    const query = `
      SELECT * FROM students 
      WHERE name ILIKE $1 OR enrollment_no ILIKE $1 OR email ILIKE $1;
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  async filterStudents(filters) {
    const conditions = [];
    const values = [];
    let queryIdx = 1;

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push(`${key} = $${queryIdx}`);
        values.push(value);
        queryIdx++;
      }
    }

    let query = `SELECT * FROM students`;
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getStudentStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_students,
        AVG(cgpa) as average_cgpa,
        department,
        placement_status,
        COUNT(id) OVER (PARTITION BY department) as department_count,
        COUNT(id) OVER (PARTITION BY placement_status) as placement_count
      FROM students
      GROUP BY department, placement_status;
    `;
    // A simpler query might be better for general stats, we can do multiple queries
    const totalQuery = `SELECT COUNT(*) FROM students;`;
    const placementQuery = `SELECT placement_status, COUNT(*) FROM students GROUP BY placement_status;`;
    const deptQuery = `SELECT department, COUNT(*) FROM students GROUP BY department;`;
    const avgCgpaQuery = `SELECT AVG(cgpa) FROM students;`;

    const [total, placement, dept, avg] = await Promise.all([
      pool.query(totalQuery),
      pool.query(placementQuery),
      pool.query(deptQuery),
      pool.query(avgCgpaQuery)
    ]);

    return {
      totalStudents: parseInt(total.rows[0].count),
      placementStats: placement.rows,
      departmentStats: dept.rows,
      averageCgpa: parseFloat(avg.rows[0].avg).toFixed(2)
    };
  }
}

export default new StudentModel();
