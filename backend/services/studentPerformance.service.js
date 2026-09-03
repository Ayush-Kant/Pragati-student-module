import { pool } from '../config/db.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

const normalizeNumber = (value) => Number(Number(value || 0).toFixed(2));

const getStudentUserId = async (studentId) => {
  const result = await pool.query('SELECT user_id FROM students WHERE id = $1 LIMIT 1', [studentId]);
  if (!result.rows[0]?.user_id) return null;
  return Number(result.rows[0].user_id);
};

const buildOverallScore = ({ assessment, assignment, coding, project }) => {
  const scores = [assessment, assignment, coding, project].filter((value) => Number.isFinite(value));
  return scores.length ? normalizeNumber(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0;
};

export const getPerformance = async (user, driveId = null) => {
  const studentId = await resolveStudentId(user);
  const userId = await getStudentUserId(studentId);
  if (!userId) {
    const error = new Error('Student account link not found');
    error.statusCode = 404;
    throw error;
  }

  const driveCondition = driveId ? 'AND sdp.drive_id = $2' : '';
  const baseParams = driveId ? [studentId, Number(driveId)] : [studentId];

  if (driveId) {
    const enrollment = await pool.query(
      `SELECT 1 FROM student_drive_progress sdp WHERE sdp.student_id = $1 AND sdp.drive_id = $2 LIMIT 1`,
      [studentId, Number(driveId)],
    );
    if (!enrollment.rows[0]) {
      const error = new Error('Student is not enrolled in this placement drive');
      error.statusCode = 403;
      throw error;
    }
  }

  const [activity, progress, attendance, trend, rank, submissions, xp] = await Promise.all([
    pool.query(
      `SELECT
        COALESCE((SELECT AVG(a.percentage) FROM student_assessment_attempts a
                  ${driveId ? 'JOIN student_drive_progress sdp ON sdp.student_id = a.student_id' : ''}
                  WHERE a.student_id = $1 AND a.status IN ('submitted','auto_submitted') AND a.percentage IS NOT NULL ${driveId ? 'AND sdp.drive_id = $2' : ''}), 0) AS assessment_average,
        (SELECT COUNT(*) FROM student_assessment_attempts a
                  ${driveId ? 'JOIN student_drive_progress sdp ON sdp.student_id = a.student_id' : ''}
                  WHERE a.student_id = $1 AND a.status IN ('submitted','auto_submitted') ${driveId ? 'AND sdp.drive_id = $2' : ''})::int AS assessment_attempted,
        COALESCE((SELECT AVG(100.0 * ag.score / NULLIF(a.total_marks,0)) FROM assignment_grades ag
                  JOIN assignments a ON a.id = ag.assignment_id
                  ${driveId ? 'JOIN student_drive_progress sdp ON sdp.student_id = ag.student_id' : ''}
                  WHERE ag.student_id = $1 ${driveId ? 'AND sdp.drive_id = $2' : ''}), 0) AS assignment_average,
        (SELECT COUNT(*) FROM assignment_grades ag
                  ${driveId ? 'JOIN student_drive_progress sdp ON sdp.student_id = ag.student_id' : ''}
                  WHERE ag.student_id = $1 ${driveId ? 'AND sdp.drive_id = $2' : ''})::int AS assignment_attempted,
        COALESCE((SELECT AVG(total_score) FROM challenge_submissions cs WHERE cs.student_id = $3 ${driveId ? 'AND EXISTS (SELECT 1 FROM student_drive_progress sdp WHERE sdp.student_id = $1 AND sdp.drive_id = $2)' : ''}), 0) AS coding_average,
        (SELECT COUNT(*) FROM challenge_submissions cs WHERE cs.student_id = $3)::int AS coding_attempted,
        COALESCE((SELECT AVG(pe.score) FROM project_evaluations pe JOIN student_projects sp ON sp.id = pe.project_id WHERE sp.student_id = $1), 0) AS project_average,
        (SELECT COUNT(*) FROM project_submissions ps JOIN student_projects sp ON sp.id = ps.project_id WHERE sp.student_id = $1)::int AS project_submitted`,
      [studentId, ...(driveId ? [Number(driveId)] : []), userId],
    ),
    pool.query(
      `SELECT tc.id AS "courseId", tc.title,
              COALESCE(scp.progress,0)::int AS progress,
              COALESCE(scp.completed_lessons,0)::int AS completed_lessons,
              COALESCE(scp.total_lessons,0)::int AS total_lessons
       FROM training_courses tc
       LEFT JOIN student_course_progress scp
         ON scp.course_id = tc.id AND scp.student_id = $1
       WHERE tc.status = 'published'
       ORDER BY tc.id`,
      [studentId],
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE attended)::int AS attended
       FROM session_attendance
       WHERE student_id = $1`,
      [userId],
    ),
    pool.query(
      `WITH weekly AS (
         SELECT DATE_TRUNC('week', submitted_at)::date AS week_start,
                AVG(percentage)::numeric AS score
         FROM student_assessment_attempts
         WHERE student_id = $1
           AND status IN ('submitted','auto_submitted')
           AND percentage IS NOT NULL
           AND submitted_at >= NOW() - INTERVAL '12 weeks'
         GROUP BY DATE_TRUNC('week', submitted_at)
       )
       SELECT TO_CHAR(week_start, 'YYYY-MM-DD') AS week,
              ROUND(score,2) AS score
       FROM weekly ORDER BY week_start`,
      [studentId],
    ),
    pool.query(
      `WITH student_scores AS (
         SELECT s.id AS student_id,
                COALESCE(AVG(scp.progress),0) AS score
         FROM students s
         LEFT JOIN student_course_progress scp ON scp.student_id = s.id
         WHERE s.status <> 'blocked'
         GROUP BY s.id
       )
       SELECT student_id, RANK() OVER (ORDER BY score DESC) AS rank,
              ROUND(score,2) AS score,
              COUNT(*) OVER () AS total_students
       FROM student_scores
       WHERE student_id = $1`,
      [studentId],
    ),
    pool.query(
      `SELECT id AS "submissionId", 'assessment' AS type,
              COALESCE((SELECT title FROM assessments a WHERE a.id = saa.assessment_id), 'Assessment') AS "activityTitle",
              percentage AS score, submitted_at AS "submittedAt"
       FROM student_assessment_attempts saa
       WHERE student_id = $1 AND status IN ('submitted','auto_submitted')
       UNION ALL
       SELECT ag.id, 'assignment', a.title,
              ROUND(100.0 * ag.score / NULLIF(a.total_marks,0),2), ag.graded_at
       FROM assignment_grades ag JOIN assignments a ON a.id = ag.assignment_id
       WHERE ag.student_id = $1
       ORDER BY "submittedAt" DESC NULLS LAST, "submissionId" DESC
       LIMIT 50`,
      [studentId],
    ),
    pool.query(
      `SELECT COALESCE((SELECT COUNT(*) FROM lesson_progress WHERE student_id = $1 AND completed),0)
              + COALESCE((SELECT COUNT(*) FROM assignment_grades WHERE student_id = $1),0) * 10
              + COALESCE((SELECT COUNT(*) FROM challenge_submissions WHERE student_id = $2),0) * 15 AS xp`,
      [studentId, userId],
    ),
  ]);

  const row = activity.rows[0] || {};
  const assessmentAverage = normalizeNumber(row.assessment_average);
  const assignmentAverage = normalizeNumber(row.assignment_average);
  const codingAverage = Number(row.coding_attempted) ? normalizeNumber(row.coding_average) : null;
  const projectAverage = Number(row.project_submitted) ? normalizeNumber(row.project_average) : null;
  const overallScore = buildOverallScore({
    assessment: Number(row.assessment_attempted) ? assessmentAverage : null,
    assignment: Number(row.assignment_attempted) ? assignmentAverage : null,
    coding: codingAverage,
    project: projectAverage,
  });

  const totalAttendance = Number(attendance.rows[0]?.total || 0);
  const attended = Number(attendance.rows[0]?.attended || 0);
  const attendancePercent = totalAttendance ? normalizeNumber((attended / totalAttendance) * 100) : 0;
  const ranking = rank.rows[0];
  const totalStudents = Number(ranking?.total_students || 0);
  const rankValue = ranking ? Number(ranking.rank) : null;
  const percentile = rankValue && totalStudents > 1 ? normalizeNumber(((totalStudents - rankValue) / (totalStudents - 1)) * 100) : rankValue === 1 ? 100 : 0;

  return {
    overallScore,
    batchRank: rankValue,
    batchPercentile: percentile,
    totalStudents,
    xpTotal: Number(xp.rows[0]?.xp || 0),
    activityScores: {
      quizzes: { avgScore: assessmentAverage, attempted: Number(row.assessment_attempted || 0), total: Number(row.assessment_attempted || 0) },
      assignments: { avgScore: assignmentAverage, attempted: Number(row.assignment_attempted || 0), total: Number(row.assignment_attempted || 0) },
      codingChallenges: { avgScore: codingAverage, attempted: Number(row.coding_attempted || 0), total: Number(row.coding_attempted || 0) },
      projects: { avgScore: projectAverage, submitted: Boolean(Number(row.project_submitted || 0)) },
    },
    attendancePercent,
    sessionsAttended: attended,
    totalSessions: totalAttendance,
    moduleProgress: progress.rows.map((item) => ({
      courseId: Number(item.courseId),
      title: item.title,
      progress: Number(item.progress || 0),
      completedLessons: Number(item.completed_lessons || 0),
      totalLessons: Number(item.total_lessons || 0),
    })),
    improvementTrend: trend.rows.map((item) => ({ week: item.week, avgScore: normalizeNumber(item.score) })),
    attendanceHeatmap: [],
    submissionHistory: submissions.rows.map((item) => ({
      submissionId: String(item.submissionId),
      activityTitle: item.activityTitle,
      type: item.type,
      score: item.score == null ? null : normalizeNumber(item.score),
      submittedAt: item.submittedAt,
    })),
    driveId: driveId ? Number(driveId) : null,
  };
};

export const getSubmissionHistory = async (user, filters = {}) => {
  const studentId = await resolveStudentId(user);
  const type = filters.type ? String(filters.type).toLowerCase() : null;
  const allowedTypes = new Set(['quiz', 'assessment', 'assignment', 'coding', 'casestudy', 'project']);
  if (type && !allowedTypes.has(type)) {
    const error = new Error('Invalid type filter');
    error.statusCode = 400;
    throw error;
  }
  const page = Math.max(Number.parseInt(filters.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit, 10) || 10, 1), 50);
  const offset = (page - 1) * limit;

  const typeCondition = type
    ? `WHERE type = ${['quiz','assessment'].includes(type) ? "'assessment'" : `'${type}'`}`
    : '';
  const result = await pool.query(
    `WITH history AS (
       SELECT saa.id AS submission_id, 'assessment' AS type,
              COALESCE(a.title,'Assessment') AS activity_title,
              saa.percentage AS score, saa.submitted_at
       FROM student_assessment_attempts saa
       LEFT JOIN assessments a ON a.id = saa.assessment_id
       WHERE saa.student_id = $1 AND saa.status IN ('submitted','auto_submitted')
       UNION ALL
       SELECT ag.id, 'assignment', a.title,
              100.0 * ag.score / NULLIF(a.total_marks,0), ag.graded_at
       FROM assignment_grades ag JOIN assignments a ON a.id = ag.assignment_id
       WHERE ag.student_id = $1
       UNION ALL
       SELECT cs.id, 'coding', COALESCE(a.title,'Coding Challenge'), cs.total_score, cs.submitted_at
       FROM challenge_submissions cs LEFT JOIN assessments a ON a.id = cs.challenge_id
       JOIN students s ON s.user_id = cs.student_id
       WHERE s.id = $1
     ), filtered AS (SELECT * FROM history ${typeCondition})
     SELECT *, COUNT(*) OVER() AS total_count
     FROM filtered
     ORDER BY submitted_at DESC NULLS LAST, submission_id DESC
     LIMIT $2 OFFSET $3`,
    [studentId, limit, offset],
  );

  return {
    submissions: result.rows.map((item) => ({
      submissionId: String(item.submission_id),
      activityTitle: item.activity_title,
      type: item.type,
      score: item.score == null ? null : normalizeNumber(item.score),
      submittedAt: item.submitted_at,
    })),
    pagination: {
      page,
      limit,
      total: Number(result.rows[0]?.total_count || 0),
      totalPages: Math.ceil(Number(result.rows[0]?.total_count || 0) / limit),
    },
  };
};

export default { getPerformance, getSubmissionHistory };
