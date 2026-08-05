import { pool } from '../../config/db.js';

export const addFeedback = async (assignmentId, studentId, feedbackData) => {
    const { remarks, grade } = feedbackData;
    const result = await pool.query(
        `INSERT INTO assignment_feedback (assignment_id, student_id, remarks, grade)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET remarks = EXCLUDED.remarks, grade = EXCLUDED.grade, created_at = NOW()
     RETURNING id, assignment_id, student_id, remarks, grade, created_at`,
        [assignmentId, studentId, remarks, grade],
    );

    return {
        assignmentId: result.rows[0].assignment_id,
        studentId: result.rows[0].student_id,
        remarks: result.rows[0].remarks,
        grade: result.rows[0].grade,
        createdAt: result.rows[0].created_at,
    };
};

export default {
    addFeedback,
};
