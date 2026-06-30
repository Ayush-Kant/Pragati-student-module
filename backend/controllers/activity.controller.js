import { pool } from "../config/db.js";

/*
POST /api/activity/assessments
Create a new assessment
*/
export const createAssessment = async (req, res) => {
    try {
        const {
            title,
            description,
            due_date,
            created_by
        } = req.body;

        if (!title || !created_by) {
            return res.status(400).json({
                success: false,
                message: "title and created_by are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO assessments (
                title,
                description,
                due_date,
                created_by
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [
                title,
                description || null,
                due_date || null,
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
            message: "Failed to create assessment"
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
            message: "Failed to fetch assessments"
        });
    }
};


/*
POST /api/activity/submissions
Create a submission
*/
export const createSubmission = async (req, res) => {
    try {
        const {
            assessment_id,
            student_id,
            submission_url
        } = req.body;

        if (
            !assessment_id ||
            !student_id ||
            !submission_url
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "assessment_id, student_id and submission_url are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO submissions (
                assessment_id,
                student_id,
                submission_url
            )
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
            [
                assessment_id,
                student_id,
                submission_url
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
            message: "Failed to create submission"
        });
    }
};


/*
GET /api/activity/submissions/:assessmentId
Get submissions for an assessment
*/
export const getSubmissions = async (req, res) => {
    try {
        const { assessmentId } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM submissions
            WHERE assessment_id = $1
            ORDER BY submitted_at DESC;
            `,
            [assessmentId]
        );

        res.status(200).json({
            success: true,
            submissions: result.rows
        });

    } catch (error) {
        console.error("Get Submissions Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch submissions"
        });
    }
};