import { pool } from "../config/db.js";
import { generateCertificatePDF } from "./pdf.service.js";
import { sendCertificateEmail } from "./mail.service.js";
import { randomUUID } from "crypto";

export const validateCompletionCriteria = async (
  userId,
  driveId,
  minScore = 70,
) => {
  // 1. Resolve student details
  const userResult = await pool.query(
    "SELECT id, full_name, email FROM users WHERE id = $1 AND role = 'student'",
    [userId],
  );
  if (userResult.rows.length === 0) {
    throw new Error("Student user not found");
  }
  const studentUser = userResult.rows[0];

  // Resolve students table id
  const studentResult = await pool.query(
    "SELECT id FROM students WHERE user_id = $1",
    [userId],
  );
  const studentIdVal =
    studentResult.rows.length > 0 ? studentResult.rows[0].id : null;

  // 2. Resolve recruitment drive
  const driveResult = await pool.query(
    "SELECT id, title, assigned_course_id, mentor_id FROM recruitment_drives WHERE id = $1",
    [driveId],
  );
  if (driveResult.rows.length === 0) {
    throw new Error("Recruitment drive not found");
  }
  const drive = driveResult.rows[0];

  // 3. Score validation
  // Get score from student_drive_progress or student_progress or average activity score
  let score = null;
  if (studentIdVal) {
    const sdpResult = await pool.query(
      "SELECT assessment_score FROM student_drive_progress WHERE student_id = $1 AND drive_id = $2",
      [studentIdVal, driveId],
    );
    if (
      sdpResult.rows.length > 0 &&
      sdpResult.rows[0].assessment_score !== null
    ) {
      score = parseFloat(sdpResult.rows[0].assessment_score);
    }
  }

  if (score === null) {
    const spResult = await pool.query(
      "SELECT readiness_score FROM student_progress WHERE student_id = $1 AND drive_id = $2",
      [userId, driveId],
    );
    if (spResult.rows.length > 0 && spResult.rows[0].readiness_score !== null) {
      score = parseFloat(spResult.rows[0].readiness_score);
    }
  }

  // If still null, check average activity score or set a fallback/default
  if (score === null) {
    const activityResult = await pool.query(
      "SELECT AVG(score) as avg_score FROM activity_submissions WHERE student_id = $1 AND drive_id = $2 AND score IS NOT NULL",
      [userId, driveId],
    );
    if (
      activityResult.rows.length > 0 &&
      activityResult.rows[0].avg_score !== null
    ) {
      score = parseFloat(activityResult.rows[0].avg_score);
    }
  }

  // If we can't find a score, default to 0 or use the score passed in the request if available
  if (score === null) {
    score = 0;
  }

  if (score < minScore) {
    throw new Error(
      `Minimum overall score criteria not met. Current score: ${score}%, Required: ${minScore}%`,
    );
  }

  // 4. Lessons completed validation
  // Find course assigned to this drive
  const courseId = drive.assigned_course_id;
  if (courseId) {
    // Get all lessons for this course
    const lessonsResult = await pool.query(
      `SELECT l.id
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = $1`,
      [courseId],
    );
    const totalLessons = lessonsResult.rows.length;

    if (totalLessons > 0) {
      const lessonIds = lessonsResult.rows.map((r) => r.id);
      // Check how many are completed by this student in lesson_progress
      const completedResult = await pool.query(
        `SELECT COUNT(*) as completed_count
         FROM lesson_progress
         WHERE student_id = $1 AND lesson_id = ANY($2) AND completed = true`,
        [userId, lessonIds],
      );
      const completedLessons = parseInt(
        completedResult.rows[0].completed_count,
      );

      if (completedLessons < totalLessons) {
        throw new Error(
          `Mandatory lessons not completed. Completed: ${completedLessons}/${totalLessons}`,
        );
      }
    }
  }

  // 5. Activities submitted validation
  // Get all unique activity titles or check if student has any pending/unsubmitted activities in activity_submissions
  // If student has any activities that are not in 'submitted', 'graded', or 'approved' status, they haven't submitted everything.
  const pendingActivities = await pool.query(
    `SELECT COUNT(*) as count
     FROM activity_submissions
     WHERE student_id = $1 AND drive_id = $2 AND status IN ('pending', 'rejected')`,
    [userId, driveId],
  );
  if (parseInt(pendingActivities.rows[0].count) > 0) {
    throw new Error(
      `Mandatory activities have not been submitted or approved.`,
    );
  }

  return {
    studentUser,
    drive,
    score,
  };
};

export const issueCertificate = async ({
  studentId,
  driveId,
  score: passedScore,
  minScore = 70,
}) => {
  // Prevent duplicate certificates
  const existingCert = await pool.query(
    "SELECT id FROM certificates WHERE student_id = $1 AND drive_id = $2",
    [studentId, driveId],
  );
  if (existingCert.rows.length > 0) {
    throw new Error("Certificate already exists for this student and drive");
  }

  // 1. Validate criteria
  const { studentUser, drive, score } = await validateCompletionCriteria(
    studentId,
    driveId,
    minScore,
  );

  const finalScore = passedScore !== undefined ? passedScore : score;

  // 2. Generate UUID
  const verifyUuid = randomUUID();
  const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/api/v1/certificates/verify/${verifyUuid}`;

  // Get mentor details
  let mentorName = "Course Mentor";
  if (drive.mentor_id) {
    const mentorResult = await pool.query(
      "SELECT full_name FROM users WHERE id = $1",
      [drive.mentor_id],
    );
    if (mentorResult.rows.length > 0) {
      mentorName = mentorResult.rows[0].full_name;
    }
  }

  // 3. Generate PDF
  const pdfDetails = await generateCertificatePDF({
    studentName: studentUser.full_name,
    driveName: drive.title,
    score: finalScore,
    completionDate: new Date().toLocaleDateString(),
    mentorName,
    verifyUrl,
    verifyUuid,
  });

  // 4. Save to database
  const insertResult = await pool.query(
    `INSERT INTO certificates (student_id, drive_id, certificate_url, verify_uuid, score)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [studentId, driveId, pdfDetails.url, verifyUuid, finalScore],
  );

  const certificate = insertResult.rows[0];

  // 5. Send email (non-blocking / error-safe)
  try {
    await sendCertificateEmail({
      toEmail: studentUser.email,
      studentName: studentUser.full_name,
      driveName: drive.title,
      certificateUrl: pdfDetails.url,
      verifyUrl,
      pdfPath: pdfDetails.filePath,
    });
  } catch (mailErr) {
    console.error("⚠️ Failed to send certificate email:", mailErr.message);
  }

  return certificate;
};

export const getCertificateById = async (id) => {
  const result = await pool.query("SELECT * FROM certificates WHERE id = $1", [
    id,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

export const verifyCertificateByUuid = async (uuid) => {
  const result = await pool.query(
    `SELECT c.id, c.student_id, c.drive_id, c.score, c.issued_at, c.revoked, c.revoked_at,
            u.full_name as student_name, d.title as drive_title
     FROM certificates c
     JOIN users u ON c.student_id = u.id
     LEFT JOIN recruitment_drives d ON c.drive_id = d.id
     WHERE c.verify_uuid = $1`,
    [uuid],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

export const revokeCertificateById = async (id) => {
  const result = await pool.query(
    `UPDATE certificates
     SET revoked = true, revoked_at = NOW()
     WHERE id = $1 AND revoked = false
     RETURNING *`,
    [id],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};
