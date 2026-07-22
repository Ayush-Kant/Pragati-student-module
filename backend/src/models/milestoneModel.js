// milestoneModel.js
import { pool } from "../../config/db.js";

/**
 * Fetches all milestones for a specific project.
 * @param {number} projectId 
 * @returns {Promise<Array>}
 */
export const getMilestones = async (projectId) => {
  const result = await pool.query(
    `SELECT id, project_id AS "projectId", milestone_number AS "milestoneNumber", 
            title, description, due_at AS "dueAt", created_at, updated_at
     FROM project_milestones 
     WHERE project_id = $1 
     ORDER BY milestone_number ASC`,
    [projectId]
  );
  return result.rows;
};

/**
 * Fetches milestone details by ID.
 * @param {number} milestoneId 
 * @returns {Promise<object|null>}
 */
export const getMilestoneById = async (milestoneId) => {
  const result = await pool.query(
    `SELECT id, project_id AS "projectId", milestone_number AS "milestoneNumber", 
            title, description, due_at AS "dueAt", created_at, updated_at
     FROM project_milestones 
     WHERE id = $1`,
    [milestoneId]
  );
  return result.rows[0] || null;
};

/**
 * Inserts or updates a milestone submission record.
 * @param {number} projectId 
 * @param {number} milestoneId 
 * @param {number} studentId 
 * @param {string} githubUrl 
 * @param {string} deployedUrl 
 * @returns {Promise<object>}
 */
export const submitMilestone = async (projectId, milestoneId, studentId, githubUrl, deployedUrl) => {
  const result = await pool.query(
    `INSERT INTO project_milestone_submissions 
       (project_id, milestone_id, student_id, github_url, deployed_url, submitted_at, status, updated_at)
     VALUES 
       ($1, $2, $3, $4, $5, NOW(), 'submitted', NOW())
     ON CONFLICT (milestone_id, student_id) 
     DO UPDATE SET 
       github_url = EXCLUDED.github_url,
       deployed_url = EXCLUDED.deployed_url,
       submitted_at = NOW(),
       status = 'submitted',
       updated_at = NOW()
     RETURNING 
       id, project_id AS "projectId", milestone_id AS "milestoneId", student_id AS "studentId",
       github_url AS "githubUrl", deployed_url AS "deployedUrl", submitted_at AS "submittedAt", status`,
    [projectId, milestoneId, studentId, githubUrl, deployedUrl]
  );
  return result.rows[0];
};

export default {
  getMilestones,
  getMilestoneById,
  submitMilestone
};
