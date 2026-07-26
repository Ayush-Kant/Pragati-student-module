import { pool } from "../config/db.js";

export const getAllBadges = async () => {
  const result = await pool.query(
    "SELECT id, name, description, icon_url, criteria_json, created_at FROM badges ORDER BY id ASC",
  );
  return result.rows;
};

export const getStudentBadges = async (studentId) => {
  const result = await pool.query(
    `SELECT b.id, b.name, b.description, b.icon_url, sb.awarded_at
     FROM student_badges sb
     JOIN badges b ON sb.badge_id = b.id
     WHERE sb.student_id = $1
     ORDER BY sb.awarded_at DESC`,
    [studentId],
  );
  return result.rows;
};

export const evaluateAndAwardBadges = async (userId) => {
  // Get all badges
  const badgesResult = await pool.query("SELECT * FROM badges");
  const badges = badgesResult.rows;

  // Get student's already awarded badge IDs
  const awardedResult = await pool.query(
    "SELECT badge_id FROM student_badges WHERE student_id = $1",
    [userId],
  );
  const awardedBadgeIds = new Set(awardedResult.rows.map((r) => r.badge_id));

  const newlyAwarded = [];

  for (const badge of badges) {
    if (awardedBadgeIds.has(badge.id)) {
      continue;
    }

    let earned = false;

    if (badge.name === "First Submission") {
      const subResult = await pool.query(
        "SELECT COUNT(*) as count FROM activity_submissions WHERE student_id = $1",
        [userId],
      );
      if (parseInt(subResult.rows[0].count) >= 1) {
        earned = true;
      }
    } else if (badge.name === "Perfect Quiz Score") {
      const quizResult = await pool.query(
        "SELECT COUNT(*) as count FROM activity_submissions WHERE student_id = $1 AND activity_type = 'quiz' AND score = 100",
        [userId],
      );
      if (parseInt(quizResult.rows[0].count) >= 1) {
        earned = true;
      }
    } else if (badge.name === "Top Coder") {
      const topCoderResult = await pool.query(
        `SELECT COUNT(*) as count FROM challenge_submissions s1
         WHERE student_id = $1
         AND total_score > 0
         AND total_score = (
             SELECT MAX(total_score) FROM challenge_submissions s2
             WHERE s2.challenge_id = s1.challenge_id
         )`,
        [userId],
      );
      if (parseInt(topCoderResult.rows[0].count) >= 1) {
        earned = true;
      }
    } else if (badge.name === "Consistent Learner") {
      const datesResult = await pool.query(
        `SELECT DISTINCT DATE(act_date) as act_date FROM (
             SELECT created_at as act_date FROM activity_submissions WHERE student_id = $1
             UNION
             SELECT updated_at as act_date FROM lesson_progress WHERE student_id = $1
             UNION
             SELECT submitted_at as act_date FROM challenge_submissions WHERE student_id = $1
         ) as activities
         WHERE act_date IS NOT NULL
         ORDER BY act_date ASC`,
        [userId],
      );

      if (datesResult.rows.length >= 7) {
        const dates = datesResult.rows.map((r) =>
          new Date(r.act_date).getTime(),
        );
        let maxStreak = 0;
        let currentStreak = 0;
        let prevTime = null;

        for (const time of dates) {
          if (prevTime === null) {
            currentStreak = 1;
          } else {
            const diffDays = Math.round(
              (time - prevTime) / (1000 * 60 * 60 * 24),
            );
            if (diffDays === 1) {
              currentStreak++;
            } else if (diffDays > 1) {
              maxStreak = Math.max(maxStreak, currentStreak);
              currentStreak = 1;
            }
          }
          prevTime = time;
        }
        maxStreak = Math.max(maxStreak, currentStreak);
        if (maxStreak >= 7) {
          earned = true;
        }
      }
    } else if (badge.name === "Project Star") {
      const projResult = await pool.query(
        "SELECT COUNT(*) as count FROM activity_submissions WHERE student_id = $1 AND activity_type = 'project' AND score >= 90",
        [userId],
      );
      if (parseInt(projResult.rows[0].count) >= 1) {
        earned = true;
      }
    }

    if (earned) {
      try {
        await pool.query(
          "INSERT INTO student_badges (student_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [userId, badge.id],
        );
        newlyAwarded.push(badge);
      } catch (err) {
        console.error(
          `Error awarding badge ${badge.name} to user ${userId}:`,
          err,
        );
      }
    }
  }

  return newlyAwarded;
};
