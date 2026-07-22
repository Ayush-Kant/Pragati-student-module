// feedbackModel.js
import { pool } from "../../config/db.js";

/**
 * Fetches feedback records for a Capstone submission.
 * @param {number} submissionId 
 * @returns {Promise<Array>}
 */
export const getFeedback = async (submissionId) => {
  const result = await pool.query(
    `SELECT id, submission_id AS "submissionId", criterion, 
            score, max_score AS "maxScore", comment, created_at AS "createdAt"
     FROM project_feedback 
     WHERE submission_id = $1 
     ORDER BY id ASC`,
    [submissionId]
  );
  return result.rows.map(row => ({
    id: row.id,
    submissionId: row.submissionId,
    criterion: row.criterion,
    score: Number(row.score),
    maxScore: Number(row.maxScore),
    comment: row.comment,
    createdAt: row.createdAt
  }));
};

/**
 * Fetches rubric criteria for a project.
 * @param {number} projectId 
 * @returns {Promise<Array>}
 */
export const getRubric = async (projectId) => {
  const result = await pool.query(
    `SELECT id, project_id AS "projectId", criterion, max_score AS "maxScore", 
            description, created_at AS "createdAt"
     FROM project_rubrics 
     WHERE project_id = $1 
     ORDER BY id ASC`,
    [projectId]
  );
  return result.rows.map(row => ({
    id: row.id,
    projectId: row.projectId,
    criterion: row.criterion,
    maxScore: Number(row.maxScore),
    description: row.description,
    createdAt: row.createdAt
  }));
};

/**
 * Gets submission status of a student's final submission.
 * @param {number} projectId 
 * @param {number} studentId 
 * @returns {Promise<object|null>}
 */
export const getSubmissionStatus = async (projectId, studentId) => {
  const result = await pool.query(
    `SELECT id, status, submitted_at AS "submittedAt"
     FROM project_submissions 
     WHERE project_id = $1 AND student_id = $2`,
    [projectId, studentId]
  );
  return result.rows[0] || null;
};

export default {
  getFeedback,
  getRubric,
  getSubmissionStatus
};
