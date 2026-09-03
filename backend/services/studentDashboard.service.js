import { pool } from '../config/db.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

const asNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getDashboard = async (user) => {
  const studentId = await resolveStudentId(user);
  const userId = Number(user?.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error('Authenticated user is not valid');
    error.statusCode = 401;
    throw error;
  }

  const [profileResult, driveResult, statsResult, progressResult, sessionsResult, tasksResult, leaderboardResult, notificationsResult] = await Promise.all([
    pool.query(
      `SELECT s.id, s.name, s.email
       FROM students s
       WHERE s.id = $1
       LIMIT 1`,
      [studentId],
    ),
    pool.query(
      `SELECT
         dp.drive_id AS id,
         rd.title,
         c.name AS "companyName",
         dp.current_stage AS "currentStage",
         dp.stage AS status,
         dp.stage_updated_at AS "stageUpdatedAt",
         rd.application_deadline AS "applicationDeadline"
       FROM student_drive_progress dp
       JOIN recruitment_drives rd ON rd.id = dp.drive_id
       LEFT JOIN companies c ON c.id = rd.company_id
       WHERE dp.student_id = $1
         AND rd.status <> 'completed'
       ORDER BY dp.stage_updated_at DESC NULLS LAST, dp.id DESC
       LIMIT 1`,
      [studentId],
    ),
    pool.query(
      `SELECT
         (SELECT COUNT(*) FROM assignment_submissions a
          WHERE a.student_id = $1
            AND a.status IN ('submitted', 'late', 'pending')) AS assignments_completed,
         (SELECT COUNT(*) FROM student_assessment_attempts saa
          WHERE saa.student_id = $1
            AND saa.status IN ('submitted', 'auto_submitted')) AS assessments_taken,
         (SELECT COUNT(DISTINCT scp.course_id) FROM student_course_progress scp
          WHERE scp.student_id = $1 AND scp.progress = 100) AS courses_completed,
         (SELECT COUNT(DISTINCT cs.challenge_id) FROM challenge_submissions cs
          WHERE cs.student_id = $2 AND cs.total_score > 0) AS coding_problems_solved,
         (SELECT COUNT(*) FROM session_attendance sa WHERE sa.student_id = $2 AND sa.attended = TRUE) AS sessions_attended,
         (SELECT COUNT(*) FROM student_assessment_attempts saa
          WHERE saa.student_id = $1
            AND saa.status IN ('submitted', 'auto_submitted')
            AND saa.percentage IS NOT NULL) AS graded_attempts,
         (SELECT COALESCE(AVG(saa.percentage), 0) FROM student_assessment_attempts saa
          WHERE saa.student_id = $1
            AND saa.status IN ('submitted', 'auto_submitted')
            AND saa.percentage IS NOT NULL) AS assessment_avg,
         (SELECT COALESCE(AVG(100.0 * ag.score / NULLIF(a.total_marks, 0)), 0)
          FROM assignment_grades ag
          JOIN assignments a ON a.id = ag.assignment_id
          WHERE ag.student_id = $1) AS assignment_avg,
         (SELECT COALESCE(AVG(cs.total_score), 0) FROM challenge_submissions cs
          WHERE cs.student_id = $2 AND cs.total_score IS NOT NULL) AS coding_avg`,
      [studentId, userId],
    ),
    pool.query(
      `SELECT
         COUNT(*) AS total_modules,
         COUNT(*) FILTER (WHERE module_progress.progress = 100) AS completed_modules,
         COALESCE(AVG(module_progress.progress), 0) AS completion_percent
       FROM (
         SELECT cm.id,
                CASE
                  WHEN COUNT(l.id) = 0 THEN 0
                  ELSE ROUND(100.0 * COUNT(lp.id) FILTER (WHERE lp.completed = TRUE) / COUNT(l.id), 2)
                END AS progress
         FROM course_modules cm
         LEFT JOIN lessons l ON l.module_id = cm.id
         LEFT JOIN lesson_progress lp
           ON lp.lesson_id = l.id
          AND lp.student_id = $1
         GROUP BY cm.id
       ) module_progress`,
      [studentId],
    ),
    pool.query(
      `SELECT
         ls.id,
         ls.title,
         ls.trainer AS mentor,
         ls.scheduled_at AS "scheduledAt",
         ls.duration,
         ls.status,
         ls.session_type AS "sessionType"
       FROM live_sessions ls
       WHERE ls.scheduled_at >= NOW()
          OR ls.status IN ('Upcoming', 'Scheduled', 'Live')
       ORDER BY ls.scheduled_at ASC NULLS LAST
       LIMIT 5`,
    ),
    pool.query(
      `SELECT id, title, due_date AS "dueAt", subject
       FROM assignments a
       WHERE (a.student_id IS NULL OR a.student_id = $1)
         AND a.status <> 'closed'
         AND NOT EXISTS (
           SELECT 1
           FROM assignment_submissions s
           WHERE s.assignment_id = a.id AND s.student_id = $1
         )
       ORDER BY a.due_date ASC
       LIMIT 5`,
      [studentId],
    ),
    pool.query(
      `SELECT
         ROW_NUMBER() OVER (ORDER BY COALESCE(sdp.training_completion, 0) DESC, sdp.stage_updated_at ASC) AS rank,
         s.name,
         COALESCE(sdp.training_completion, 0) AS completion
       FROM student_drive_progress sdp
       JOIN students s ON s.id = sdp.student_id
       WHERE sdp.drive_id = (
         SELECT dp.drive_id
         FROM student_drive_progress dp
         JOIN recruitment_drives rd ON rd.id = dp.drive_id
         WHERE dp.student_id = $1
           AND rd.status <> 'completed'
         ORDER BY dp.stage_updated_at DESC NULLS LAST, dp.id DESC
         LIMIT 1
       )
       ORDER BY rank
       LIMIT 5`,
      [studentId],
    ),
    pool.query(
      `SELECT id, title, message, type, link_url AS "linkUrl", is_read AS read, created_at AS "createdAt"
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId],
    ),
  ]);

  const profile = profileResult.rows[0] || { name: user?.name || 'Student', email: user?.email || null };
  const rawStats = statsResult.rows[0] || {};
  const progress = progressResult.rows[0] || {};
  const totalSessions = await pool.query('SELECT COUNT(*)::int AS count FROM live_sessions');

  const assessmentAvg = asNumber(rawStats.assessment_avg);
  const assignmentAvg = asNumber(rawStats.assignment_avg);
  const codingAvg = asNumber(rawStats.coding_avg);
  const scoreParts = [
    rawStats.graded_attempts > 0 ? assessmentAvg : null,
    assignmentAvg > 0 ? assignmentAvg : null,
    codingAvg > 0 ? codingAvg : null,
  ].filter((value) => value !== null);

  const overallScore = scoreParts.length
    ? Math.round((scoreParts.reduce((sum, value) => sum + value, 0) / scoreParts.length) * 10) / 10
    : 0;

  const totalSessionCount = asNumber(totalSessions.rows[0]?.count);
  const sessionsAttended = asNumber(rawStats.sessions_attended);
  const attendanceRate = totalSessionCount
    ? `${Math.round((sessionsAttended / totalSessionCount) * 100)}%`
    : '0%';

  return {
    activeDrive: driveResult.rows[0] || null,
    stats: {
      xpEarned: 0,
      assignmentsCompleted: asNumber(rawStats.assignments_completed),
      sessionsAttended,
      overallScore,
      coursesCompleted: asNumber(rawStats.courses_completed),
      assessmentsTaken: asNumber(rawStats.assessments_taken),
      codingProblemsSolved: asNumber(rawStats.coding_problems_solved),
      attendanceRate,
    },
    progress: {
      overallPercentage: Math.round(asNumber(progress.completion_percent)),
      completionPercent: Math.round(asNumber(progress.completion_percent)),
      modulesCompleted: asNumber(progress.completed_modules),
      totalModules: asNumber(progress.total_modules),
    },
    upcomingSessions: sessionsResult.rows,
    pendingTasks: tasksResult.rows.map((task) => ({
      taskId: task.id,
      title: task.title,
      type: 'assignment',
      subject: task.subject,
      dueAt: task.dueAt,
    })),
    leaderboard: leaderboardResult.rows.map((entry) => ({
      rank: asNumber(entry.rank),
      name: entry.name,
      studentName: entry.name,
      score: asNumber(entry.completion),
      percentile: null,
    })),
    notifications: notificationsResult.rows,
    student: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
    },
  };
};

export default {
  getDashboard,
};
