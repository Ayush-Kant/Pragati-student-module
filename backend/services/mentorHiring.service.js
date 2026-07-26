import { pool } from "../config/db.js";

// Resolve mentor id from auth uid — shared helper
const getMentorId = async (uid) => {
  const res = await pool.query(
    `SELECT mentors.id FROM mentors
     INNER JOIN users ON users.id = mentors.user_id
     INNER JOIN auth_users ON auth_users.id = users.auth_user_id
     WHERE auth_users.uuid_id = $1`,
    [uid]
  );
  return res.rows[0]?.id ?? null;
};

// PATCH courses/:id/hiring-relevant
export const updateCourseHiringRelevantService = async ({ userId, courseId, hiringRelevant }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };

  const res = await pool.query(
    `UPDATE courses SET hiring_relevant = $1, updated_at = NOW()
     WHERE id = $2 AND mentor_id = $3
     RETURNING id, hiring_relevant`,
    [hiringRelevant, courseId, mentorId]
  );
  if (res.rows.length === 0) return { status: 404, message: "Course not found" };
  return { status: 200, data: { courseId: res.rows[0].id, hiringRelevant: res.rows[0].hiring_relevant } };
};

// PATCH projects/:id/hiring-relevant
export const updateProjectHiringRelevantService = async ({ userId, projectId, hiringRelevant }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };

  const res = await pool.query(
    `UPDATE projects SET hiring_relevant = $1, updated_at = NOW()
     WHERE id = $2 AND mentor_id = $3
     RETURNING id, hiring_relevant`,
    [hiringRelevant, projectId, mentorId]
  );
  if (res.rows.length === 0) return { status: 404, message: "Project not found" };
  return { status: 200, data: { projectId: res.rows[0].id, hiringRelevant: res.rows[0].hiring_relevant } };
};

// PATCH drives/:id/skills
export const updateDriveSkillsService = async ({ userId, driveId, requiredSkills }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };

  // Verify drive belongs to this mentor
  const check = await pool.query(
    `SELECT id FROM recruitment_drives WHERE id = $1 AND mentor_id = $2`,
    [driveId, mentorId]
  );
  if (check.rows.length === 0) return { status: 404, message: "Drive not found" };

  const res = await pool.query(
    `UPDATE recruitment_drives SET required_skills = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, required_skills`,
    [requiredSkills, driveId]
  );
  return { status: 200, data: { driveId: res.rows[0].id, requiredSkills: res.rows[0].required_skills } };
};

// PATCH drives/:id/readiness-threshold
export const updateReadinessThresholdService = async ({ userId, driveId, minimumReadinessScore }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };

  const check = await pool.query(
    `SELECT id FROM recruitment_drives WHERE id = $1 AND mentor_id = $2`,
    [driveId, mentorId]
  );
  if (check.rows.length === 0) return { status: 404, message: "Drive not found" };

  const res = await pool.query(
    `UPDATE recruitment_drives SET minimum_readiness_score = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, minimum_readiness_score`,
    [minimumReadinessScore, driveId]
  );
  return { status: 200, data: { driveId: res.rows[0].id, minimumReadinessScore: res.rows[0].minimum_readiness_score } };
};

// PATCH students/:id/shortlist
export const shortlistStudentService = async ({ userId, studentId, shortlisted }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };

  // Mentor can only shortlist students in their drives
  const res = await pool.query(
    `UPDATE student_drive_progress SET is_shortlisted = $1
     WHERE student_id = $2
       AND drive_id IN (SELECT id FROM recruitment_drives WHERE mentor_id = $3)
     RETURNING student_id, is_shortlisted`,
    [shortlisted, studentId, mentorId]
  );
  if (res.rows.length === 0) return { status: 404, message: "Student not found in mentor drives" };
  return { status: 200, data: { studentId: res.rows[0].student_id, shortlisted: res.rows[0].is_shortlisted } };
};

// PATCH students/:id/recommendation
export const saveRecommendationService = async ({ userId, studentId, recommendation }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };

  const res = await pool.query(
    `UPDATE student_drive_progress SET mentor_recommendation = $1
     WHERE student_id = $2
       AND drive_id IN (SELECT id FROM recruitment_drives WHERE mentor_id = $3)
     RETURNING student_id`,
    [recommendation, studentId, mentorId]
  );
  if (res.rows.length === 0) return { status: 404, message: "Student not found in mentor drives" };
  return { status: 200, data: { studentId: res.rows[0].student_id, saved: true } };
};

// GET students/shortlisted
export const getShortlistedStudentsService = async ({ userId }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };

  const res = await pool.query(
    `SELECT
       s.id            AS "studentId",
       s.name,
       sdp.assessment_score AS "readinessScore",
       sdp.is_shortlisted   AS "shortlisted"
     FROM student_drive_progress sdp
     INNER JOIN students s ON s.id = sdp.student_id
     INNER JOIN recruitment_drives rd ON rd.id = sdp.drive_id
     WHERE rd.mentor_id = $1 AND sdp.is_shortlisted = TRUE`,
    [mentorId]
  );
  return { status: 200, data: res.rows };
};
