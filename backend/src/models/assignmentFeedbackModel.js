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

export const getFeedback = async (assignmentId, studentId) => {
    const result = await pool.query(
        `SELECT
            af.id,
            af.assignment_id,
            af.student_id,
            af.remarks,
            af.grade,
            af.inline_comments,
            af.created_at AS feedback_created_at,
            ag.score,
            ag.remarks AS grade_remarks,
            ag.created_at AS grade_created_at,
            a.total_marks,
            a.allow_resubmission,
            a.max_resubmissions,
            COALESCE((
              SELECT MAX(asub.attempt_number)
              FROM assignment_submissions asub
              WHERE asub.assignment_id = a.id AND asub.student_id = $2
            ), 0) AS latest_attempt
         FROM assignment_feedback af
         JOIN assignments a ON a.id = af.assignment_id
         LEFT JOIN assignment_grades ag
           ON ag.assignment_id = af.assignment_id AND ag.student_id = af.student_id
         WHERE af.assignment_id = $1 AND af.student_id = $2
         LIMIT 1`,
        [assignmentId, studentId],
    );

    if (!result.rows[0]) return null;
    const row = result.rows[0];

    return {
        id: row.id,
        assignmentId: row.assignment_id,
        studentId: row.student_id,
        remarks: row.remarks,
        grade: row.grade,
        inlineComments: row.inline_comments,
        feedbackCreatedAt: row.feedback_created_at,
        score: row.score == null ? null : Number(row.score),
        gradeRemarks: row.grade_remarks,
        gradeCreatedAt: row.grade_created_at,
        totalMarks: row.total_marks == null ? null : Number(row.total_marks),
        allowResubmission: Boolean(row.allow_resubmission),
        maxResubmissions: Number(row.max_resubmissions || 0),
        latestAttempt: Number(row.latest_attempt || 0),
    };
};

export default {
    addFeedback,
    getFeedback,
};
