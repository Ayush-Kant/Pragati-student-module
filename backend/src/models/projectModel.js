// projectModel.js
import { pool } from "../../config/db.js";

/**
 * Fetches basic project info by ID.
 * @param {number} projectId 
 * @returns {Promise<object|null>}
 */
export const getProjectById = async (projectId) => {
  const result = await pool.query(
    "SELECT id, title, description, final_due_at, created_at, updated_at FROM projects WHERE id = $1",
    [projectId]
  );
  return result.rows[0] || null;
};

/**
 * Fetches project details, its milestones, rubrics, and the student's assignment/submission status.
 * @param {number} projectId 
 * @param {number} studentId 
 * @returns {Promise<object|null>}
 */
export const getProjectDetails = async (projectId, studentId) => {
  // 1. Fetch project profile
  const project = await getProjectById(projectId);
  if (!project) return null;

  // 2. Fetch assignment info
  const assignmentResult = await pool.query(
    "SELECT assigned_at, status FROM student_projects WHERE project_id = $1 AND student_id = $2",
    [projectId, studentId]
  );
  const assignment = assignmentResult.rows[0] || null;

  // 3. Fetch milestones
  const milestonesResult = await pool.query(
    `SELECT id, milestone_number, title, description, due_at, created_at, updated_at 
     FROM project_milestones 
     WHERE project_id = $1 
     ORDER BY milestone_number ASC`,
    [projectId]
  );

  // 4. Fetch milestone submissions for this student
  const milestoneSubmissionsResult = await pool.query(
    `SELECT milestone_id, github_url, deployed_url, submitted_at, status 
     FROM project_milestone_submissions 
     WHERE project_id = $1 AND student_id = $2`,
    [projectId, studentId]
  );
  const milestoneSubsMap = milestoneSubmissionsResult.rows.reduce((map, sub) => {
    map[sub.milestone_id] = {
      githubUrl: sub.github_url,
      deployedUrl: sub.deployed_url,
      submittedAt: sub.submitted_at,
      status: sub.status
    };
    return map;
  }, {});

  const milestones = milestonesResult.rows.map(m => ({
    id: m.id,
    milestoneNumber: m.milestone_number,
    title: m.title,
    description: m.description,
    dueAt: m.due_at,
    submission: milestoneSubsMap[m.id] || null
  }));

  // 5. Fetch final project submission for this student
  const finalSubmissionResult = await pool.query(
    `SELECT id, github_url, deployed_url, report_url, submitted_at, status 
     FROM project_submissions 
     WHERE project_id = $1 AND student_id = $2`,
    [projectId, studentId]
  );
  const finalSubmission = finalSubmissionResult.rows[0] ? {
    id: finalSubmissionResult.rows[0].id,
    githubUrl: finalSubmissionResult.rows[0].github_url,
    deployedUrl: finalSubmissionResult.rows[0].deployed_url,
    reportUrl: finalSubmissionResult.rows[0].report_url,
    submittedAt: finalSubmissionResult.rows[0].submitted_at,
    status: finalSubmissionResult.rows[0].status
  } : null;

  // 6. Fetch Rubric
  const rubricsResult = await pool.query(
    "SELECT id, criterion, max_score, description FROM project_rubrics WHERE project_id = $1",
    [projectId]
  );

  return {
    ...project,
    assigned: !!assignment,
    assignmentStatus: assignment ? assignment.status : null,
    assignedAt: assignment ? assignment.assigned_at : null,
    milestones,
    finalSubmission,
    rubric: rubricsResult.rows.map(r => ({
      id: r.id,
      criterion: r.criterion,
      maxScore: Number(r.max_score),
      description: r.description
    }))
  };
};

/**
 * Checks whether a student is assigned to a given project.
 * @param {number} projectId
 * @param {number} studentId
 * @returns {Promise<boolean>}
 */
export const checkStudentProjectAssignment = async (projectId, studentId) => {
  const result = await pool.query(
    "SELECT id FROM student_projects WHERE project_id = $1 AND student_id = $2",
    [projectId, studentId]
  );
  return result.rows.length > 0;
};

export default {
  checkStudentProjectAssignment,
  getProjectById,
  getProjectDetails
};
