import { pool } from "../../config/db.js";


export const getAttendance = async () => {

    const result = await pool.query(
        `
        SELECT
            sa.id,
            sa.session_id AS "sessionId",
            sa.student_id AS "studentId",
            sa.status,
            sa.created_at AS "createdAt"

        FROM session_attendance sa

        ORDER BY sa.created_at DESC
        `
    );

    return result.rows;
};



export const markAttendance = async (
    sessionId,
    studentId,
    status
) => {

    const result = await pool.query(
        `
        INSERT INTO session_attendance
        (
            session_id,
            student_id,
            status
        )

        VALUES
        ($1,$2,$3)

        ON CONFLICT (session_id, student_id)

        DO UPDATE SET
            status = EXCLUDED.status

        RETURNING
            id,
            session_id AS "sessionId",
            student_id AS "studentId",
            status,
            created_at AS "createdAt"
        `,
        [
            sessionId,
            studentId,
            status
        ]
    );

    return result.rows[0];
};



export const updateAttendance = async (
    sessionId,
    studentId,
    status
) => {

    const result = await pool.query(
        `
        UPDATE session_attendance

        SET status = $3

        WHERE session_id = $1
        AND student_id = $2

        RETURNING
            id,
            session_id AS "sessionId",
            student_id AS "studentId",
            status,
            created_at AS "createdAt"
        `,
        [
            sessionId,
            studentId,
            status
        ]
    );

    return result.rows[0] || null;
};



export default {
    getAttendance,
    markAttendance,
    updateAttendance
};