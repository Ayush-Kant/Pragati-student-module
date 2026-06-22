import { pool } from "../config/db.js";
import { sendInterviewScheduledEmail, sendInterviewResultEmail } from "../src/modules/company/services/email.service.js";

/**
 * Fetch all interviews
 */
const getInterviews = async () => {
    const result = await pool.query(`
        SELECT *
        FROM interviews
        ORDER BY scheduled_at DESC
    `);

    return result.rows;
};

/**
 * Fetch interview by ID
 */
const getInterviewById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM interviews WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};

/**
 * Schedule interview
 */
const createInterview = async ({
    applicationId,
    scheduledAt,
    interviewType,
    interviewerId,
}) => {
    // Generate mock meeting link
    const meetingLink = `https://meet.google.com/mock-meet-${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`;

    const result = await pool.query(
        `
        INSERT INTO interviews
        (
            application_id,
            scheduled_at,
            interview_type,
            interviewer_id,
            meeting_link
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
            applicationId,
            scheduledAt,
            interviewType,
            interviewerId || null,
            meetingLink,
        ]
    );

    const interview = result.rows[0];

    // Try to notify candidate via email
    try {
        const candidateDetails = await pool.query(
            `
            SELECT u.email, u.full_name
            FROM applications a
            JOIN users u ON a.student_id = u.id
            WHERE a.id = $1
            `,
            [applicationId]
        );

        if (candidateDetails.rows.length > 0) {
            const { email, full_name } = candidateDetails.rows[0];
            await sendInterviewScheduledEmail(
                email,
                full_name,
                interviewType,
                scheduledAt,
                meetingLink
            );
        }
    } catch (emailErr) {
        console.error("[interview.service] Failed to send email:", emailErr.message);
    }

    return interview;
};

/**
 * Save interviewer feedback
 */
const submitFeedback = async (id, feedback) => {
    const result = await pool.query(
        `
        UPDATE interviews
        SET feedback = $2
        WHERE id = $1
        RETURNING *
        `,
        [id, feedback]
    );

    return result.rows[0];
};

/**
 * Update interview result/status
 */
const updateResult = async (id, resultStatus, attendanceStatus) => {
    // Determine status and attendance based on result
    let status = 'completed';
    let attendance = attendanceStatus || 'present';

    if (attendance === 'absent') {
        status = 'no_show';
    }

    const result = await pool.query(
        `
        UPDATE interviews
        SET result = $2,
            status = $3,
            attendance = $4
        WHERE id = $1
        RETURNING *
        `,
        [id, resultStatus, status, attendance]
    );

    const interview = result.rows[0];

    if (interview) {
        // Try to notify candidate via email
        try {
            const candidateDetails = await pool.query(
                `
                SELECT u.email, u.full_name
                FROM interviews i
                JOIN applications a ON i.application_id = a.id
                JOIN users u ON a.student_id = u.id
                WHERE i.id = $1
                `,
                [id]
            );

            if (candidateDetails.rows.length > 0) {
                const { email, full_name } = candidateDetails.rows[0];
                await sendInterviewResultEmail(
                    email,
                    full_name,
                    interview.interview_type,
                    resultStatus
                );
            }
        } catch (emailErr) {
            console.error("[interview.service] Failed to send email:", emailErr.message);
        }
    }

    return result.rows[0];
};

export {
    getInterviews,
    getInterviewById,
    createInterview,
    submitFeedback,
    updateResult,
};