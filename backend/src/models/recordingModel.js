import { pool } from "../../config/db.js";


export const getRecordings = async () => {

    const result = await pool.query(
        `
        SELECT
            id,
            session_id AS "sessionId",
            title,
            duration,
            recording_url AS "recordingUrl"

        FROM session_recordings

        ORDER BY id DESC
        `
    );

    return result.rows;
};



export const getRecordingById = async (id) => {

    const result = await pool.query(
        `
        SELECT
            id,
            session_id AS "sessionId",
            title,
            duration,
            recording_url AS "recordingUrl"

        FROM session_recordings

        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};



export default {
    getRecordings,
    getRecordingById
};