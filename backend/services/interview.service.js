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
            student_id,
            drive_id,
            scheduled_at,
            title,
            interviewer_id,
            meeting_link
        )
        SELECT id, student_id, drive_id, $2, $3, $4, $5
        FROM applications
        WHERE id = $1
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
            SELECT s.email, s.name AS full_name
            FROM applications a
            JOIN students s ON a.student_id = s.id
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
        SET feedback = $2,
            updated_at = NOW()
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
            attendance = $4,
            updated_at = NOW()
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
                SELECT s.email, s.name AS full_name
                FROM interviews i
                JOIN applications a ON i.application_id = a.id
                JOIN students s ON a.student_id = s.id
                WHERE i.id = $1
                `,
                [id]
            );

            if (candidateDetails.rows.length > 0) {
                const { email, full_name } = candidateDetails.rows[0];
                await sendInterviewResultEmail(
                    email,
                    full_name,
                    interview.title,
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
