// submissionModel.js
import { pool } from "../../config/db.js";

/**
 * Submits the final capstone project.
 * @param {number} projectId 
 * @param {number} studentId 
 * @param {string} githubUrl 
 * @param {string} deployedUrl 
 * @param {string} reportUrl 
 * @returns {Promise<object>}
 */
export const submitFinalProject = async (projectId, studentId, githubUrl, deployedUrl, reportUrl) => {
  const result = await pool.query(
    `INSERT INTO project_submissions 
       (project_id, student_id, github_url, deployed_url, report_url, submitted_at, status, updated_at)
     VALUES 
       ($1, $2, $3, $4, $5, NOW(), 'submitted', NOW())
     ON CONFLICT (project_id, student_id) 
     DO UPDATE SET 
       github_url = EXCLUDED.github_url,
       deployed_url = EXCLUDED.deployed_url,
       report_url = EXCLUDED.report_url,
       submitted_at = NOW(),
       status = 'submitted',
       updated_at = NOW()
     RETURNING 
       id, project_id AS "projectId", student_id AS "studentId", github_url AS "githubUrl", 
       deployed_url AS "deployedUrl", report_url AS "reportUrl", submitted_at AS "submittedAt", status`,
    [projectId, studentId, githubUrl, deployedUrl, reportUrl]
  );
  return result.rows[0];
};

/**
 * Retrieves the student's submission for a project.
 * @param {number} projectId 
 * @param {number} studentId 
 * @returns {Promise<object|null>}
 */
export const getSubmission = async (projectId, studentId) => {
  const result = await pool.query(
    `SELECT id, project_id AS "projectId", student_id AS "studentId", github_url AS "githubUrl",
            deployed_url AS "deployedUrl", report_url AS "reportUrl", submitted_at AS "submittedAt", status
     FROM project_submissions 
     WHERE project_id = $1 AND student_id = $2`,
    [projectId, studentId]
  );
  return result.rows[0] || null;
};

/**
 * Updates a submission record status or other fields.
 * @param {number} submissionId 
 * @param {object} updateData 
 * @returns {Promise<object|null>}
 */
export const updateSubmission = async (submissionId, updateData) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, val] of Object.entries(updateData)) {
    // Map camelCase keys to snake_case column names
    let columnName = key;
    if (key === "githubUrl") columnName = "github_url";
    if (key === "deployedUrl") columnName = "deployed_url";
    if (key === "reportUrl") columnName = "report_url";
    
    fields.push(`${columnName} = $${index}`);
    values.push(val);
    index++;
  }

  if (fields.length === 0) return null;

  values.push(submissionId);
  const query = `
    UPDATE project_submissions 
    SET ${fields.join(", ")}, updated_at = NOW() 
    WHERE id = $${index} 
    RETURNING 
      id, project_id AS "projectId", student_id AS "studentId", github_url AS "githubUrl", 
      deployed_url AS "deployedUrl", report_url AS "reportUrl", submitted_at AS "submittedAt", status`;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export default {
  submitFinalProject,
  getSubmission,
  updateSubmission
};
