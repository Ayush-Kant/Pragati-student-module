import { pool } from '../config/db.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

const APPLICATION_STATUSES = new Set([
  'APPLIED',
  'SHORTLISTED',
  'ASSESSMENT',
  'TECHNICAL_INTERVIEW',
  'HR_INTERVIEW',
  'SELECTED',
  'REJECTED',
  'WITHDRAWN',
]);

const normalizeUserStudent = async (user) => Number(await resolveStudentId(user));

const applicationDto = (row) => ({
  applicationId: Number(row.id),
  companyName: row.company_name,
  jobTitle: row.job_title,
  jobId: row.job_id,
  status: row.status,
  appliedDate: row.applied_date,
  notes: row.notes,
  history: Array.isArray(row.history) ? row.history : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export async function getPlacementDashboard(user) {
  const studentId = await normalizeUserStudent(user);
  const [applications, interviews, skills, recommendations] = await Promise.all([
    getApplications(studentId),
    getPlacementInterviews(studentId),
    getSkillReadiness(studentId),
    getCareerRecommendations(studentId),
  ]);

  const counts = applications.reduce(
    (acc, application) => {
      acc.total += 1;
      if (['SHORTLISTED', 'ASSESSMENT', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW', 'SELECTED'].includes(application.status)) acc.shortlisted += 1;
      if (application.status === 'SELECTED') acc.selected += 1;
      if (application.status === 'REJECTED') acc.rejected += 1;
      if (application.status === 'WITHDRAWN') acc.withdrawn += 1;
      return acc;
    },
    { total: 0, shortlisted: 0, selected: 0, rejected: 0, withdrawn: 0 },
  );

  const interviewCounts = interviews.reduce(
    (acc, interview) => {
      acc.total += 1;
      if (interview.status === 'SCHEDULED') acc.scheduled += 1;
      if (interview.status === 'COMPLETED') acc.completed += 1;
      if (interview.status === 'CANCELLED') acc.cancelled += 1;
      return acc;
    },
    { total: 0, scheduled: 0, completed: 0, cancelled: 0 },
  );

  return {
    applicationStatistics: counts,
    interviewStatistics: interviewCounts,
    selectionRate: counts.total ? Math.round((counts.selected / counts.total) * 100) : 0,
    upcomingInterviews: interviews
      .filter((interview) => new Date(interview.dateTime).getTime() >= Date.now() && interview.status !== 'CANCELLED')
      .slice(0, 5),
    skillReadiness: skills,
    careerRecommendations: recommendations,
    analytics: await getPlacementAnalytics(studentId),
  };
}

export async function getApplications(studentId, filters = {}) {
  const values = [Number(studentId)];
  const clauses = ['student_id = $1'];

  if (filters.status) {
    const status = String(filters.status).toUpperCase();
    if (!APPLICATION_STATUSES.has(status)) {
      const error = new Error('Invalid application status');
      error.statusCode = 400;
      throw error;
    }
    values.push(status);
    clauses.push(`status = $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${String(filters.search).trim()}%`);
    clauses.push(`(company_name ILIKE $${values.length} OR job_title ILIKE $${values.length})`);
  }

  const result = await pool.query(
    `SELECT id, company_name, job_title, job_id, status, applied_date, notes, history, created_at, updated_at
     FROM job_applications
     WHERE ${clauses.join(' AND ')}
     ORDER BY created_at DESC, id DESC`,
    values,
  );

  return result.rows.map(applicationDto);
}

export async function getApplicationById(studentId, applicationId) {
  const result = await pool.query(
    `SELECT id, company_name, job_title, job_id, status, applied_date, notes, history, created_at, updated_at
     FROM job_applications WHERE id = $1 AND student_id = $2 LIMIT 1`,
    [Number(applicationId), Number(studentId)],
  );
  if (!result.rows[0]) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }
  return applicationDto(result.rows[0]);
}

export async function createApplication(studentId, payload) {
  const companyName = String(payload?.companyName || '').trim();
  const jobTitle = String(payload?.jobTitle || '').trim();
  const jobId = payload?.jobId ? String(payload.jobId).trim() : null;
  const notes = payload?.notes ? String(payload.notes).trim() : null;

  if (!companyName || !jobTitle) {
    const error = new Error('companyName and jobTitle are required');
    error.statusCode = 400;
    throw error;
  }

  const existing = await pool.query(
    `SELECT 1 FROM job_applications
     WHERE student_id = $1
       AND LOWER(company_name) = LOWER($2)
       AND LOWER(job_title) = LOWER($3)
       AND status NOT IN ('WITHDRAWN', 'REJECTED')
     LIMIT 1`,
    [Number(studentId), companyName, jobTitle],
  );
  if (existing.rows[0]) {
    const error = new Error('An active application already exists for this company and position');
    error.statusCode = 409;
    throw error;
  }

  const history = JSON.stringify([
    { status: 'APPLIED', changedAt: new Date().toISOString(), note: 'Application submitted' },
  ]);
  const result = await pool.query(
    `INSERT INTO job_applications (student_id, company_name, job_title, job_id, status, applied_date, notes, history)
     VALUES ($1, $2, $3, $4, 'APPLIED', COALESCE($5::timestamptz, NOW()), $6, $7::jsonb)
     RETURNING id, company_name, job_title, job_id, status, applied_date, notes, history, created_at, updated_at`,
    [Number(studentId), companyName, jobTitle, jobId, payload?.appliedDate || null, notes, history],
  );
  return applicationDto(result.rows[0]);
}

export async function updateApplicationStatus(studentId, applicationId, status, note = '') {
  const targetStatus = String(status || '').toUpperCase();
  if (!APPLICATION_STATUSES.has(targetStatus)) {
    const error = new Error('Invalid application status');
    error.statusCode = 400;
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query(
      `SELECT id, status, history FROM job_applications WHERE id = $1 AND student_id = $2 FOR UPDATE`,
      [Number(applicationId), Number(studentId)],
    );
    if (!current.rows[0]) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    if (current.rows[0].status === targetStatus) {
      await client.query('ROLLBACK');
      return getApplicationById(studentId, applicationId);
    }

    const history = Array.isArray(current.rows[0].history) ? current.rows[0].history : [];
    history.push({
      status: targetStatus,
      previousStatus: current.rows[0].status,
      changedAt: new Date().toISOString(),
      note: String(note || '').trim() || `Status updated to ${targetStatus}`,
    });

    const updated = await client.query(
      `UPDATE job_applications SET status = $1, history = $2::jsonb, updated_at = NOW()
       WHERE id = $3 AND student_id = $4
       RETURNING id, company_name, job_title, job_id, status, applied_date, notes, history, created_at, updated_at`,
      [targetStatus, JSON.stringify(history), Number(applicationId), Number(studentId)],
    );
    await client.query('COMMIT');
    return applicationDto(updated.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function withdrawApplication(studentId, applicationId) {
  return updateApplicationStatus(studentId, applicationId, 'WITHDRAWN', 'Application withdrawn by student');
}

export async function getPlacementInterviews(studentId, filters = {}) {
  const params = [Number(studentId)];
  let statusClause = '';
  if (filters.status && String(filters.status).toLowerCase() !== 'all') {
    params.push(String(filters.status).toUpperCase());
    statusClause = `AND status = $${params.length}`;
  }

  const result = await pool.query(
    `SELECT id, application_id, company_name, job_title, date_time, location, type, status, feedback, score,
            created_at, updated_at
     FROM placement_interviews
     WHERE student_id = $1 ${statusClause}
     ORDER BY date_time ASC, id ASC`,
    params,
  );

  return result.rows.map((row) => {
    const dateTime = new Date(row.date_time);
    const joinableAt = new Date(dateTime.getTime() - 15 * 60 * 1000);
    return {
      interviewId: Number(row.id),
      applicationId: row.application_id ? Number(row.application_id) : null,
      companyName: row.company_name,
      jobTitle: row.job_title,
      dateTime: row.date_time,
      location: row.location,
      type: row.type,
      status: row.status,
      feedback: row.feedback,
      score: row.score == null ? null : Number(row.score),
      joinable: Date.now() >= joinableAt.getTime() && Date.now() <= dateTime.getTime() + 2 * 60 * 60 * 1000 && row.status !== 'CANCELLED',
      joinableAt: joinableAt.toISOString(),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });
}

export async function getSkillReadiness(studentId) {
  const result = await pool.query(
    `SELECT id, skill_name, current_score, target_score, priority, category, last_evaluated_at
     FROM skill_readiness WHERE student_id = $1
     ORDER BY CASE priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END, current_score ASC, skill_name ASC`,
    [Number(studentId)],
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    skillName: row.skill_name,
    currentScore: Number(row.current_score),
    targetScore: Number(row.target_score),
    gap: Math.max(Number(row.target_score) - Number(row.current_score), 0),
    priority: row.priority,
    category: row.category,
    lastEvaluatedAt: row.last_evaluated_at,
  }));
}

export async function getSkillGaps(studentId) {
  const skills = await getSkillReadiness(studentId);
  return skills.filter((skill) => skill.gap > 0);
}

export async function getCareerRecommendations(studentId) {
  const result = await pool.query(
    `SELECT id, title, priority, reason, current_state, target_state, recommended_action, created_at, updated_at
     FROM career_recommendations WHERE student_id = $1 ORDER BY created_at DESC, id DESC`,
    [Number(studentId)],
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    title: row.title,
    priority: row.priority,
    reason: row.reason,
    currentState: row.current_state,
    targetState: row.target_state,
    recommendedAction: row.recommended_action,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getPlacementAnalytics(studentId) {
  const [applications, interviews, skillSummary] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE status = 'SHORTLISTED')::int AS shortlisted,
              COUNT(*) FILTER (WHERE status = 'SELECTED')::int AS selected,
              COUNT(*) FILTER (WHERE status = 'REJECTED')::int AS rejected,
              COUNT(*) FILTER (WHERE status = 'WITHDRAWN')::int AS withdrawn
       FROM job_applications WHERE student_id = $1`,
      [Number(studentId)],
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE status = 'COMPLETED')::int AS completed,
              COUNT(*) FILTER (WHERE status = 'SCHEDULED')::int AS scheduled
       FROM placement_interviews WHERE student_id = $1`,
      [Number(studentId)],
    ),
    pool.query(
      `SELECT COALESCE(AVG(current_score),0)::numeric AS average_score,
              COUNT(*) FILTER (WHERE current_score < target_score)::int AS gaps
       FROM skill_readiness WHERE student_id = $1`,
      [Number(studentId)],
    ),
  ]);

  const apps = applications.rows[0];
  const rounds = interviews.rows[0];
  const skills = skillSummary.rows[0];
  return {
    applications: {
      total: Number(apps.total),
      shortlisted: Number(apps.shortlisted),
      selected: Number(apps.selected),
      rejected: Number(apps.rejected),
      withdrawn: Number(apps.withdrawn),
    },
    interviews: {
      total: Number(rounds.total),
      scheduled: Number(rounds.scheduled),
      completed: Number(rounds.completed),
    },
    skills: {
      averageScore: Number(skills.average_score || 0),
      gapCount: Number(skills.gaps || 0),
    },
    conversionRates: {
      shortlistConversionRate: Number(apps.total) ? Math.round((Number(apps.shortlisted) / Number(apps.total)) * 100) : 0,
      selectionConversionRate: Number(apps.total) ? Math.round((Number(apps.selected) / Number(apps.total)) * 100) : 0,
    },
  };
}

export async function getStudentPlacementDashboard(user) {
  return getPlacementDashboard(user);
}

export default {
  getPlacementDashboard,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  withdrawApplication,
  getPlacementInterviews,
  getSkillReadiness,
  getSkillGaps,
  getCareerRecommendations,
  getPlacementAnalytics,
  getStudentPlacementDashboard,
};
