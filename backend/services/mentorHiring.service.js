import { pool } from "../config/db.js";
import notificationService from "./notification.service.js";

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

export const updateCourseHiringRelevantService = async ({ userId, courseId, hiringRelevant }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };
  const res = await pool.query(`UPDATE courses SET hiring_relevant = $1, updated_at = NOW() WHERE id = $2 AND mentor_id = $3 RETURNING id, hiring_relevant`, [hiringRelevant, courseId, mentorId]);
  if (res.rows.length === 0) return { status: 404, message: "Course not found" };
  return { status: 200, data: { courseId: res.rows[0].id, hiringRelevant: res.rows[0].hiring_relevant } };
};

export const updateProjectHiringRelevantService = async ({ userId, projectId, hiringRelevant }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };
  const res = await pool.query(`UPDATE projects SET hiring_relevant = $1, updated_at = NOW() WHERE id = $2 AND mentor_id = $3 RETURNING id, hiring_relevant`, [hiringRelevant, projectId, mentorId]);
  if (res.rows.length === 0) return { status: 404, message: "Project not found" };
  return { status: 200, data: { projectId: res.rows[0].id, hiringRelevant: res.rows[0].hiring_relevant } };
};

export const updateDriveSkillsService = async ({ userId, driveId, requiredSkills }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };
  const check = await pool.query(`SELECT id FROM recruitment_drives WHERE id = $1 AND mentor_id = $2`, [driveId, mentorId]);
  if (check.rows.length === 0) return { status: 404, message: "Drive not found" };
  const res = await pool.query(`UPDATE recruitment_drives SET required_skills = $1, updated_at = NOW() WHERE id = $2 RETURNING id, required_skills`, [requiredSkills, driveId]);
  return { status: 200, data: { driveId: res.rows[0].id, requiredSkills: res.rows[0].required_skills } };
};

export const updateReadinessThresholdService = async ({ userId, driveId, minimumReadinessScore }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };
  const check = await pool.query(`SELECT id FROM recruitment_drives WHERE id = $1 AND mentor_id = $2`, [driveId, mentorId]);
  if (check.rows.length === 0) return { status: 404, message: "Drive not found" };
  const res = await pool.query(`UPDATE recruitment_drives SET minimum_readiness_score = $1, updated_at = NOW() WHERE id = $2 RETURNING id, minimum_readiness_score`, [minimumReadinessScore, driveId]);
  return { status: 200, data: { driveId: res.rows[0].id, minimumReadinessScore: res.rows[0].minimum_readiness_score } };
};

export const shortlistStudentService = async ({ userId, studentId, shortlisted }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };
  const res = await pool.query(
    `UPDATE student_drive_progress SET is_shortlisted = $1
     WHERE student_id = $2
       AND drive_id IN (SELECT id FROM recruitment_drives WHERE mentor_id = $3)
     RETURNING student_id, drive_id, is_shortlisted`,
    [shortlisted, studentId, mentorId]
  );
  if (res.rows.length === 0) return { status: 404, message: "Student not found in mentor drives" };

  if (res.rows[0].is_shortlisted) {
    try {
      const drive = await pool.query(`SELECT title FROM recruitment_drives WHERE id = $1 LIMIT 1`, [res.rows[0].drive_id]);
      await notificationService.sendNotificationToStudents({
        studentIds: [res.rows[0].student_id],
        title: 'You have been shortlisted',
        message: `${drive.rows[0]?.title || 'A placement drive'} has shortlisted you for the next stage.`,
        type: notificationService.NOTIFICATION_TYPES.SHORTLISTED,
        linkUrl: '/student/dashboard',
      });
    } catch (notificationError) {
      console.error('[mentorHiring] Failed to dispatch shortlist notification:', notificationError.message);
    }
  }

  return { status: 200, data: { studentId: res.rows[0].student_id, shortlisted: res.rows[0].is_shortlisted } };
};

export const saveRecommendationService = async ({ userId, studentId, recommendation }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };
  const res = await pool.query(`UPDATE student_drive_progress SET mentor_recommendation = $1 WHERE student_id = $2 AND drive_id IN (SELECT id FROM recruitment_drives WHERE mentor_id = $3) RETURNING student_id`, [recommendation, studentId, mentorId]);
  if (res.rows.length === 0) return { status: 404, message: "Student not found in mentor drives" };
  return { status: 200, data: { studentId: res.rows[0].student_id, saved: true } };
};

export const getShortlistedStudentsService = async ({ userId }) => {
  const mentorId = await getMentorId(userId);
  if (!mentorId) return { status: 403, message: "Forbidden" };
  const res = await pool.query(
    `SELECT s.id AS "studentId", s.name, sdp.assessment_score AS "readinessScore", sdp.is_shortlisted AS "shortlisted"
     FROM student_drive_progress sdp
     INNER JOIN students s ON s.id = sdp.student_id
     INNER JOIN recruitment_drives rd ON rd.id = sdp.drive_id
     WHERE rd.mentor_id = $1 AND sdp.is_shortlisted = TRUE`,
    [mentorId]
  );
  return { status: 200, data: res.rows };
};
