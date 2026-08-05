import { pool } from '../../config/db.js';

export const addGrade = async (assignmentId, studentId, gradeData) => {
    const { score, remarks } = gradeData;
    const result = await pool.query(
        `INSERT INTO assignment_grades (assignment_id, student_id, score, remarks)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET score = EXCLUDED.score, remarks = EXCLUDED.remarks, created_at = NOW()
     RETURNING id, assignment_id, student_id, score, remarks, created_at`,
        [assignmentId, studentId, score, remarks ?? null],
    );

    return {
        assignmentId: result.rows[0].assignment_id,
        studentId: result.rows[0].student_id,
        score: result.rows[0].score,
        remarks: result.rows[0].remarks,
        createdAt: result.rows[0].created_at,
    };
};

export default {
    addGrade,
};
