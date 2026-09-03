import { pool } from '../config/db.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

export const getPerformance = async (user) => {
  const studentId = await resolveStudentId(user);

  const [summary, scoreTrend, moduleProgress, attendanceHeatmap, ranking] = await Promise.all([
    pool.query(
      `SELECT
         COALESCE((SELECT AVG(percentage) FROM student_assessment_attempts WHERE student_id = $1 AND status IN ('submitted','auto_submitted') AND percentage IS NOT NULL),0) AS assessment_average,
         COALESCE((SELECT AVG(100.0 * ag.score / NULLIF(a.total_marks,0))
                   FROM assignment_grades ag JOIN assignments a ON a.id = ag.assignment_id
                   WHERE ag.student_id = $1),0) AS assignment_average,
         COALESCE((SELECT AVG(progress) FROM student_course_progress WHERE student_id = $1),0) AS course_progress,
         COALESCE((SELECT COUNT(*) FROM session_attendance WHERE student_id = (SELECT user_id FROM students WHERE id = $1)),0) AS attendance_records,
         COALESCE((SELECT COUNT(*) FROM session_attendance WHERE student_id = (SELECT user_id FROM students WHERE id = $1) AND attended),0) AS attended_sessions`,
      [studentId],
    ),
    pool.query(
      `SELECT TO_CHAR(DATE_TRUNC('month', submitted_at), 'YYYY-MM') AS month,
              ROUND(AVG(percentage), 2) AS score
       FROM student_assessment_attempts
       WHERE student_id = $1
         AND status IN ('submitted','auto_submitted')
         AND percentage IS NOT NULL
         AND submitted_at >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', submitted_at)
       ORDER BY DATE_TRUNC('month', submitted_at)`,
      [studentId],
    ),
    pool.query(
      `SELECT tc.id AS "courseId", tc.title,
              COALESCE(scp.progress,0)::int AS progress
       FROM training_courses tc
       LEFT JOIN student_course_progress scp
         ON scp.course_id = tc.id AND scp.student_id = $1
       WHERE tc.status = 'published'
       ORDER BY tc.id`,
      [studentId],
    ),
    pool.query(
      `SELECT DATE(lp.completed_at) AS day,
              COUNT(*) FILTER (WHERE lp.completed) AS completed_lessons
       FROM lesson_progress lp
       WHERE lp.student_id = $1
         AND lp.completed_at >= CURRENT_DATE - INTERVAL '90 days'
       GROUP BY DATE(lp.completed_at)
       ORDER BY day`,
      [studentId],
    ),
    pool.query(
      `WITH student_scores AS (
         SELECT student_id, ROUND(AVG(progress),2) AS score
         FROM student_course_progress
         GROUP BY student_id
       )
       SELECT rank, score
       FROM (
         SELECT student_id, score,
                RANK() OVER (ORDER BY score DESC) AS rank
         FROM student_scores
       ) ranked
       WHERE student_id = $1`,
      [studentId],
    ),
  ]);

  const row = summary.rows[0] || {};
  const attended = Number(row.attended_sessions || 0);
  const records = Number(row.attendance_records || 0);
  const attendanceRate = records ? Math.round((attended / records) * 100) : 0;

  return {
    summary: {
      assessmentAverage: Number(row.assessment_average || 0),
      assignmentAverage: Number(row.assignment_average || 0),
      courseProgress: Math.round(Number(row.course_progress || 0)),
      attendanceRate,
      attendedSessions: attended,
      totalAttendanceRecords: records,
    },
    scoreTrend: scoreTrend.rows.map((item) => ({ month: item.month, score: Number(item.score || 0) })),
    moduleProgress: moduleProgress.rows.map((item) => ({
      courseId: item.courseId,
      title: item.title,
      progress: Number(item.progress || 0),
    })),
    attendanceHeatmap: attendanceHeatmap.rows.map((item) => ({
      day: item.day,
      completedLessons: Number(item.completed_lessons || 0),
    })),
    ranking: ranking.rows[0]
      ? { rank: Number(ranking.rows[0].rank), score: Number(ranking.rows[0].score || 0) }
      : { rank: null, score: 0 },
  };
};

export default { getPerformance };
