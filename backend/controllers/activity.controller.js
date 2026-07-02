import { pool } from "../config/db.js";

/*
POST /api/activity/assessments
Create a new assessment
*/
export const createAssessment = async (req, res) => {
    try {
        const {
            title,
            type,
            difficulty,
            time_limit_minutes,
            total_marks,
            status,
            created_by
        } = req.body;

        if (!title || !type || !created_by) {
            return res.status(400).json({
                success: false,
                message: "title, type and created_by are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO assessments (
                title,
                type,
                difficulty,
                time_limit_minutes,
                total_marks,
                status,
                created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
            `,
            [
                title,
                type,
                difficulty || "Easy",
                time_limit_minutes || 30,
                total_marks || 100,
                status || "draft",
                created_by
            ]
        );

        res.status(201).json({
            success: true,
            assessment: result.rows[0]
        });

    } catch (error) {
        console.error("Create Assessment Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
GET /api/activity/assessments
Fetch all assessments
*/
export const getAssessments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM assessments
            ORDER BY created_at DESC;
        `);

        res.status(200).json({
            success: true,
            assessments: result.rows
        });

    } catch (error) {
        console.error("Get Assessments Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
POST /api/activity/submissions
*/
export const createSubmission = async (req, res) => {
    try {
        const {
            student_id,
            drive_id,
            activity_title,
            activity_type,
            status,
            score
        } = req.body;

        if (!student_id || !drive_id || !activity_title) {
            return res.status(400).json({
                success: false,
                message: "student_id, drive_id, and activity_title are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO activity_submissions (
                student_id,
                drive_id,
                activity_title,
                activity_type,
                status,
                score
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `,
            [
                student_id,
                drive_id,
                activity_title,
                activity_type || null,
                status || "submitted",
                score || null
            ]
        );

        res.status(201).json({
            success: true,
            submission: result.rows[0]
        });

    } catch (error) {
        console.error("Create Submission Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
GET /api/activity/submissions/:driveId
*/
export const getSubmissions = async (req, res) => {
    try {
        const { driveId } = req.params; // Using drive_id instead of assessment_id for activity_submissions

        if (!driveId) {
            return res.status(400).json({
                success: false,
                message: "driveId is required"
            });
        }

        const result = await pool.query(
            `
            SELECT *
            FROM activity_submissions
            WHERE drive_id = $1
            ORDER BY created_at DESC;
            `,
            [driveId]
        );

        res.status(200).json({
            success: true,
            submissions: result.rows
        });

    } catch (error) {
        console.error("Get Submissions Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};