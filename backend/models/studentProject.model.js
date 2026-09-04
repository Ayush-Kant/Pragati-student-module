import { pool } from '../config/db.js';

const parseJson = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value;
  return fallback;
};

export const listProjects = async (studentId) => {
  const result = await pool.query(`SELECT p.*, COALESCE(ROUND(AVG(m.progress), 0), 0)::int AS "overallProgress", CASE WHEN EXISTS (SELECT 1 FROM project_submissions ps WHERE ps.project_id = p.id AND ps.student_id = p.student_id) THEN (SELECT ps.status FROM project_submissions ps WHERE ps.project_id = p.id AND ps.student_id = p.student_id ORDER BY ps.version DESC LIMIT 1) ELSE NULL END AS "submissionStatus", CASE WHEN EXISTS (SELECT 1 FROM project_evaluations pe WHERE pe.project_id = p.id) THEN 'evaluated' ELSE NULL END AS "evaluationStatus" FROM student_projects p LEFT JOIN project_milestones m ON m.project_id = p.id WHERE p.student_id = $1 GROUP BY p.id ORDER BY p.deadline ASC, p.id DESC`, [studentId]);
  return result.rows.map(normalizeProject);
};

export const getProjectById = async (studentId, projectId) => {
  const result = await pool.query(`SELECT p.*, COALESCE(ROUND(AVG(m.progress), 0), 0)::int AS "overallProgress", CASE WHEN EXISTS (SELECT 1 FROM project_submissions ps WHERE ps.project_id = p.id AND ps.student_id = p.student_id) THEN (SELECT ps.status FROM project_submissions ps WHERE ps.project_id = p.id AND ps.student_id = p.student_id ORDER BY ps.version DESC LIMIT 1) ELSE NULL END AS "submissionStatus", CASE WHEN EXISTS (SELECT 1 FROM project_evaluations pe WHERE pe.project_id = p.id) THEN 'evaluated' ELSE NULL END AS "evaluationStatus" FROM student_projects p LEFT JOIN project_milestones m ON m.project_id = p.id WHERE p.id = $2 AND p.student_id = $1 GROUP BY p.id`, [studentId, projectId]);
  return result.rows[0] ? normalizeProject(result.rows[0]) : null;
};

export const getMilestones = async (studentId, projectId) => {
  const result = await pool.query(`SELECT m.id, m.project_id AS "projectId", m.title, m.description, m.deadline AS "dueDate", m.status, m.progress, m.milestone_order AS "order", pms.id AS "submissionId", pms.github_url AS "githubUrl", pms.deployed_url AS "deployedUrl", pms.progress_notes AS "progressNotes", pms.status AS "submissionStatus", pms.feedback AS "submissionFeedback", pms.submitted_at AS "submittedAt" FROM project_milestones m JOIN student_projects p ON p.id = m.project_id LEFT JOIN project_milestone_submissions pms ON pms.milestone_id = m.id AND pms.student_id = $1 WHERE m.project_id = $2 AND p.student_id = $1 ORDER BY m.milestone_order ASC, m.id ASC`, [studentId, projectId]);
  return result.rows;
};

export const getMilestoneSubmission = async (studentId, projectId, milestoneId) => {
  const result = await pool.query(`SELECT pms.id, pms.project_id AS "projectId", pms.milestone_id AS "milestoneId", pms.student_id AS "studentId", pms.github_url AS "githubUrl", pms.deployed_url AS "deployedUrl", pms.progress_notes AS "progressNotes", pms.status, pms.feedback, pms.submitted_at AS "submittedAt" FROM project_milestone_submissions pms JOIN student_projects p ON p.id = pms.project_id WHERE p.student_id = $1 AND p.id = $2 AND pms.milestone_id = $3 LIMIT 1`, [studentId, projectId, milestoneId]);
  return result.rows[0] || null;
};

export const upsertMilestoneSubmission = async (studentId, projectId, milestoneId, payload) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const milestone = await client.query(`SELECT m.id, m.deadline FROM project_milestones m JOIN student_projects p ON p.id = m.project_id WHERE m.id = $1 AND m.project_id = $2 AND p.student_id = $3 FOR UPDATE`, [milestoneId, projectId, studentId]);
    if (!milestone.rows[0]) return null;
    const result = await client.query(`INSERT INTO project_milestone_submissions (project_id, milestone_id, student_id, github_url, deployed_url, progress_notes, status) VALUES ($1,$2,$3,$4,$5,$6,'SUBMITTED') ON CONFLICT (student_id, milestone_id) DO UPDATE SET github_url = EXCLUDED.github_url, deployed_url = EXCLUDED.deployed_url, progress_notes = EXCLUDED.progress_notes, status = 'SUBMITTED', updated_at = NOW(), submitted_at = NOW() RETURNING id, project_id AS "projectId", milestone_id AS "milestoneId", github_url AS "githubUrl", deployed_url AS "deployedUrl", progress_notes AS "progressNotes", status, feedback, submitted_at AS "submittedAt"`, [projectId, milestoneId, studentId, payload.githubUrl, payload.deployedUrl || null, payload.progressNotes]);
    await client.query(`UPDATE project_milestones SET status = CASE WHEN COALESCE(progress,0) < 100 THEN 'IN_PROGRESS' ELSE status END, updated_at = NOW() WHERE id = $1`, [milestoneId]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
};

export const getCurrentSubmission = async (studentId, projectId) => {
  const result = await pool.query(`SELECT id, project_id AS "projectId", version, github_url AS "githubUrl", deployment_url AS "deploymentUrl", description, documentation, report_url AS "reportUrl", additional_comments AS "additionalComments", report_mime_type AS "reportMimeType", report_size_bytes AS "reportSizeBytes", status, feedback, submitted_at AS "submittedAt" FROM project_submissions WHERE student_id = $1 AND project_id = $2 ORDER BY version DESC LIMIT 1`, [studentId, projectId]);
  return result.rows[0] || null;
};

export const getSubmissionHistory = async (studentId, projectId) => {
  const result = await pool.query(`SELECT id, project_id AS "projectId", version, submitted_at AS "submittedAt", status, feedback, CASE WHEN status IN ('REJECTED','NEEDS_RESUBMISSION') THEN TRUE ELSE FALSE END AS "canResubmit" FROM project_submissions WHERE student_id = $1 AND project_id = $2 ORDER BY version DESC`, [studentId, projectId]);
  return result.rows;
};

export const createSubmission = async (studentId, projectId, payload) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const ownership = await client.query(`SELECT id FROM student_projects WHERE id = $1 AND student_id = $2 FOR UPDATE`, [projectId, studentId]);
    if (!ownership.rows[0]) return null;
    const versionResult = await client.query(`SELECT COALESCE(MAX(version),0)+1 AS version FROM project_submissions WHERE project_id = $1 AND student_id = $2`, [projectId, studentId]);
    const version = Number(versionResult.rows[0].version);
    const submissionResult = await client.query(`INSERT INTO project_submissions (project_id, student_id, version, github_url, deployment_url, description, documentation, report_url, additional_comments, report_mime_type, report_size_bytes, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'SUBMITTED') RETURNING id, project_id AS "projectId", version, github_url AS "githubUrl", deployment_url AS "deploymentUrl", description, documentation, report_url AS "reportUrl", additional_comments AS "additionalComments", report_mime_type AS "reportMimeType", report_size_bytes AS "reportSizeBytes", status, submitted_at AS "submittedAt"`, [projectId, studentId, version, payload.githubUrl, payload.deploymentUrl || null, payload.description || null, payload.documentation || null, payload.reportUrl || null, payload.additionalComments || null, payload.reportMimeType || null, payload.reportSizeBytes || null]);
    await client.query(`UPDATE student_projects SET status = 'SUBMITTED', updated_at = NOW() WHERE id = $1`, [projectId]);
    await client.query('COMMIT');
    return submissionResult.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
};

export const getEvaluation = async (studentId, projectId) => {
  const result = await pool.query(`SELECT e.id, e.project_id AS "projectId", e.score, e.status, e.criteria, e.strengths, e.improvements, e.feedback, e.evaluated_at AS "evaluatedAt" FROM project_evaluations e JOIN student_projects p ON p.id = e.project_id WHERE e.project_id = $2 AND p.student_id = $1 LIMIT 1`, [studentId, projectId]);
  if (!result.rows[0]) return null;
  return { ...result.rows[0], criteria: parseJson(result.rows[0].criteria), strengths: parseJson(result.rows[0].strengths), improvements: parseJson(result.rows[0].improvements) };
};

const normalizeProject = (row) => ({ id: row.id, title: row.title, description: row.description, objectives: parseJson(row.objectives), requirements: parseJson(row.requirements), deliverables: parseJson(row.deliverables), techStack: parseJson(row.tech_stack), resources: parseJson(row.resources), evaluationCriteria: parseJson(row.evaluation_criteria), deadline: row.deadline, assignedAt: row.assigned_at, status: row.status, overallProgress: Number(row.overallProgress || 0), submissionStatus: row.submissionStatus, evaluationStatus: row.evaluationStatus, mentorName: row.mentor_name, batchName: row.batch_name, durationWeeks: row.duration_weeks });

export default { listProjects, getProjectById, getMilestones, getMilestoneSubmission, upsertMilestoneSubmission, getCurrentSubmission, getSubmissionHistory, createSubmission, getEvaluation };
