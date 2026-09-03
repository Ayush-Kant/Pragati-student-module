import { pool } from '../../config/db.js';

export const addFeedback = async (assignmentId, studentId, feedbackData) => {
    const { remarks, grade, inlineComments = null } = feedbackData;
    const result = await pool.query(
        `INSERT INTO assignment_feedback (assignment_id, student_id, remarks, grade, inline_comments)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (assignment_id, student_id)
         DO UPDATE SET remarks = EXCLUDED.remarks,
                       grade = EXCLUDED.grade,
                       inline_comments = EXCLUDED.inline_comments,
                       created_at = NOW()
         RETURNING id, assignment_id, student_id, remarks, grade, inline_comments, created_at`,
        [assignmentId, studentId, remarks, grade, inlineComments],
    );

    return {
        assignmentId: result.rows[0].assignment_id,
        studentId: result.rows[0].student_id,
        remarks: result.rows[0].remarks,
        grade: result.rows[0].grade,
        inlineComments: result.rows[0].inline_comments,
        createdAt: result.rows[0].created_at,
    };
};

export default {
    addFeedback,
};
