import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";
import { generateCertificatePDF } from "./pdf.service.js";
import { sendCertificateEmail } from "./mail.service.js";
import { uploadCertificate, createSignedDownloadUrl, isS3Configured } from "./certificateStorage.service.js";
import notificationService from "./notification.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");

const DEFAULT_SCORE_THRESHOLD = 70;
const DEFAULT_ATTENDANCE_THRESHOLD = 60;

const normalizeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? Number(number.toFixed(2)) : fallback;
};

const clean = (value) => String(value ?? "").trim();

const getTableColumns = async (tableName) => {
  const result = await pool.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1`,
    [tableName],
  );
  return new Set(result.rows.map((row) => row.column_name));
};

const resolveStudentContext = async ({ userId, studentProfileId }) => {
  if (userId !== undefined && userId !== null) {
    const result = await pool.query(
      `SELECT u.id AS user_id,
              u.full_name,
              u.email,
              s.id AS student_id,
              s.full_name AS profile_full_name,
              s.name AS profile_name,
              s.college_id,
              s.college
         FROM users u
         LEFT JOIN students s ON s.user_id = u.id
        WHERE u.id = $1
          AND u.role = 'student'
        LIMIT 1`,
      [Number(userId)],
    );
    if (result.rows[0]) return result.rows[0];
  }

  if (studentProfileId !== undefined && studentProfileId !== null) {
    const result = await pool.query(
      `SELECT u.id AS user_id,
              u.full_name,
              u.email,
              s.id AS student_id,
              s.full_name AS profile_full_name,
              s.name AS profile_name,
              s.college_id,
              s.college
         FROM students s
         JOIN users u ON u.id = s.user_id
        WHERE s.id = $1
          AND u.role = 'student'
        LIMIT 1`,
      [Number(studentProfileId)],
    );
    if (result.rows[0]) return result.rows[0];
  }

  const error = new Error("Student account could not be resolved");
  error.statusCode = 404;
  throw error;
};

const getDriveContext = async (driveId) => {
  const result = await pool.query(
    `SELECT d.id,
            d.title,
            d.status,
            d.company_id,
            d.assigned_course_id,
            COALESCE(d.certificate_min_score, $2) AS certificate_min_score,
            COALESCE(d.certificate_min_attendance, $3) AS certificate_min_attendance,
            d.skill_domain,
            c.name AS company_name,
            co.title AS assigned_course_title,
            co.skill_tags AS assigned_course_skill_tags
       FROM recruitment_drives d
       LEFT JOIN companies c ON c.id = d.company_id
       LEFT JOIN courses co ON co.id = d.assigned_course_id
      WHERE d.id = $1
      LIMIT 1`,
    [Number(driveId), DEFAULT_SCORE_THRESHOLD, DEFAULT_ATTENDANCE_THRESHOLD],
  );

  if (!result.rows[0]) {
    const error = new Error("Recruitment drive not found");
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

const getCollegeName = async (student) => {
  if (student.college_id) {
    const result = await pool.query("SELECT name FROM colleges WHERE id = $1 LIMIT 1", [student.college_id]);
    if (result.rows[0]?.name) return result.rows[0].name;
  }
  return clean(student.college) || "";
};

const resolveSkillDomain = (drive) => {
  if (clean(drive.skill_domain)) return clean(drive.skill_domain);
  if (Array.isArray(drive.assigned_course_skill_tags) && drive.assigned_course_skill_tags.length) {
    return drive.assigned_course_skill_tags.map(clean).filter(Boolean).join(", ");
  }
  if (clean(drive.assigned_course_title)) return clean(drive.assigned_course_title);
  return "Placement Training";
};

const getAuthoritativeScore = async (student, driveId) => {
  const columns = await getTableColumns("student_progress");
  if (columns.has("overall_score")) {
    const identityColumn = columns.has("user_id") ? "user_id" : columns.has("student_id") ? "student_id" : null;
    if (identityColumn) {
      const driveCondition = columns.has("drive_id") ? " AND drive_id = $2" : "";
      const values = columns.has("drive_id") ? [student.user_id, Number(driveId)] : [student.user_id];
      const result = await pool.query(
        `SELECT overall_score
           FROM student_progress
          WHERE ${identityColumn} = $1${driveCondition}
          ORDER BY COALESCE(updated_at, created_at, NOW()) DESC
          LIMIT 1`,
        values,
      );
      if (result.rows[0]?.overall_score !== null && result.rows[0]?.overall_score !== undefined) {
        return {
          score: normalizeNumber(result.rows[0].overall_score),
          source: "student_progress.overall_score",
        };
      }
    }
  }

  const progressResult = await pool.query(
    `SELECT assessment_score
       FROM student_drive_progress
      WHERE student_id = $1
        AND drive_id = $2
        AND assessment_score IS NOT NULL
      ORDER BY stage_updated_at DESC NULLS LAST, id DESC
      LIMIT 1`,
    [student.student_id, Number(driveId)],
  );
  if (progressResult.rows[0]?.assessment_score !== null && progressResult.rows[0]?.assessment_score !== undefined) {
    return {
      score: normalizeNumber(progressResult.rows[0].assessment_score),
      source: "student_drive_progress.assessment_score",
    };
  }

  const activityResult = await pool.query(
    `SELECT AVG(
        CASE
          WHEN percentage IS NOT NULL THEN percentage
          WHEN total_marks IS NOT NULL AND total_marks > 0 THEN (score * 100.0 / total_marks)
          ELSE score
        END
      ) AS overall_score
       FROM activity_submissions
      WHERE student_id = $1
        AND drive_id = $2
        AND status NOT IN ('pending', 'rejected')
        AND score IS NOT NULL`,
    [student.student_id, Number(driveId)],
  );

  return {
    score: normalizeNumber(activityResult.rows[0]?.overall_score, 0),
    source: activityResult.rows[0]?.overall_score === null ? "no_scored_activity" : "activity_submissions",
  };
};

const getRequiredSubmissionStatus = async (studentId, driveId) => {
  const activityColumns = await getTableColumns("activities");
  const submissionColumns = await getTableColumns("activity_submissions");

  if (
    activityColumns.has("drive_id") &&
    submissionColumns.has("activity_id") &&
    activityColumns.has("is_required")
  ) {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS required_count,
              COUNT(*) FILTER (
                WHERE EXISTS (
                  SELECT 1
                    FROM activity_submissions s
                   WHERE s.activity_id = a.id
                     AND s.student_id = $1
                     AND COALESCE(s.status, 'submitted') NOT IN ('pending', 'rejected')
                )
              )::int AS submitted_count
         FROM activities a
        WHERE a.drive_id = $2
          AND a.is_required = TRUE`,
      [studentId, Number(driveId)],
    );
    const requiredCount = Number(result.rows[0]?.required_count || 0);
    const submittedCount = Number(result.rows[0]?.submitted_count || 0);
    return {
      requiredCount,
      submittedCount,
      complete: submittedCount >= requiredCount,
      source: "activities.is_required",
    };
  }

  const result = await pool.query(
    `SELECT COUNT(*)::int AS activity_count,
            COUNT(*) FILTER (WHERE COALESCE(status, 'submitted') IN ('pending', 'rejected'))::int AS incomplete_count
       FROM activity_submissions
      WHERE student_id = $1
        AND drive_id = $2`,
    [studentId, Number(driveId)],
  );
  const activityCount = Number(result.rows[0]?.activity_count || 0);
  const incompleteCount = Number(result.rows[0]?.incomplete_count || 0);
  return {
    requiredCount: activityCount,
    submittedCount: Math.max(0, activityCount - incompleteCount),
    complete: incompleteCount === 0,
    source: "activity_submissions.status",
  };
};

const getAttendanceStatus = async (userId, driveId, minimumAttendance) => {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS total_sessions,
            COUNT(*) FILTER (WHERE sa.attended = TRUE)::int AS attended_sessions
       FROM session_attendance sa
       JOIN live_sessions ls ON ls.id = sa.session_id
      WHERE sa.student_id = $1
        AND ls.drive_id = $2`,
    [userId, Number(driveId)],
  );

  const totalSessions = Number(result.rows[0]?.total_sessions || 0);
  const attendedSessions = Number(result.rows[0]?.attended_sessions || 0);
  const attendancePercent = totalSessions === 0
    ? 100
    : normalizeNumber((attendedSessions / totalSessions) * 100);

  return {
    totalSessions,
    attendedSessions,
    attendancePercent,
    requiredAttendance: minimumAttendance,
    complete: attendancePercent >= minimumAttendance,
  };
};

export const evaluateCertificateEligibility = async ({ userId, studentProfileId, driveId }) => {
  const student = await resolveStudentContext({ userId, studentProfileId });
  const drive = await getDriveContext(driveId);
  const scoreStatus = await getAuthoritativeScore(student, drive.id);
  const requiredSubmissions = await getRequiredSubmissionStatus(student.student_id, drive.id);
  const attendance = await getAttendanceStatus(
    student.user_id,
    drive.id,
    normalizeNumber(drive.certificate_min_attendance, DEFAULT_ATTENDANCE_THRESHOLD),
  );
  const minimumScore = normalizeNumber(drive.certificate_min_score, DEFAULT_SCORE_THRESHOLD);
  const driveCompleted = String(drive.status || "").toLowerCase() === "completed";

  const scoreComplete = scoreStatus.score >= minimumScore;
  const eligible = scoreComplete && requiredSubmissions.complete && attendance.complete && driveCompleted;

  const unmetCriteria = [];
  if (!scoreComplete) unmetCriteria.push(`Overall training score is ${scoreStatus.score}% but ${minimumScore}% is required.`);
  if (!requiredSubmissions.complete) unmetCriteria.push("One or more required activities are incomplete or not approved.");
  if (!attendance.complete) unmetCriteria.push(`Attendance is ${attendance.attendancePercent}% but ${attendance.requiredAttendance}% is required.`);
  if (!driveCompleted) unmetCriteria.push("The recruitment drive has not reached the completed status.");

  return {
    eligible,
    student: {
      userId: student.user_id,
      studentId: student.student_id,
      name: clean(student.full_name) || clean(student.profile_full_name) || clean(student.profile_name),
      email: student.email,
      collegeName: await getCollegeName(student),
    },
    drive: {
      id: drive.id,
      name: drive.title,
      companyName: clean(drive.company_name),
      skillDomain: resolveSkillDomain(drive),
      status: drive.status,
      minimumScore,
      minimumAttendance: attendance.requiredAttendance,
    },
    score: {
      value: scoreStatus.score,
      required: minimumScore,
      complete: scoreComplete,
      source: scoreStatus.source,
    },
    submissions: requiredSubmissions,
    attendance,
    driveCompleted,
    unmetCriteria,
  };
};

const generateVerificationCode = async (year) => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const prefix = Array.from(crypto.randomBytes(4), (byte) => alphabet[byte % alphabet.length]).join("");
    const suffix = String(crypto.randomInt(0, 10000)).padStart(4, "0");
    const candidate = `PRAG-${year}-${prefix}-${suffix}`;
    const existing = await pool.query("SELECT 1 FROM certificates WHERE verification_code = $1 LIMIT 1", [candidate]);
    if (!existing.rows.length) return candidate;
  }
  throw new Error("Unable to allocate a unique certificate verification code");
};

const getCertificateFilename = (verificationCode) =>
  `${verificationCode.replace(/[^A-Za-z0-9-]/g, "_")}.pdf`;

const safeLocalCertificatePath = (storageKey) => {
  const resolved = path.resolve(backendRoot, String(storageKey || ""));
  if (resolved !== backendRoot && !resolved.startsWith(`${backendRoot}${path.sep}`)) {
    throw new Error("Invalid certificate storage path");
  }
  return resolved;
};

const toPublicCertificate = (certificate, { apiBaseUrl, clientBaseUrl } = {}) => {
  const id = Number(certificate.id);
  const verificationCode = certificate.verification_code || certificate.verify_uuid;
  const verificationUrl = verificationCode
    ? `${String(clientBaseUrl || process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}/verify/${encodeURIComponent(verificationCode)}`
    : null;
  const downloadUrl = apiBaseUrl
    ? `${String(apiBaseUrl).replace(/\/$/, "")}/api/student/certificates/${id}/download`
    : `/api/student/certificates/${id}/download`;

  return {
    certificateId: id,
    id: String(id),
    studentId: certificate.student_id,
    driveId: certificate.drive_id,
    driveName: certificate.drive_name || certificate.drive_title || "Certificate of Completion",
    driveTitle: certificate.drive_name || certificate.drive_title || "Certificate of Completion",
    companyName: certificate.company_name || null,
    skillDomain: certificate.skill_domain || "Placement Training",
    issuedAt: certificate.issued_at,
    issueDate: certificate.issued_at,
    downloadUrl,
    verificationCode,
    verificationUrl,
    verifyUuid: certificate.verify_uuid,
    verifyUrl: verificationUrl,
    certificateUrl: certificate.certificate_url,
    revoked: Boolean(certificate.revoked),
    status: certificate.revoked ? "Revoked" : "Issued",
    title: certificate.drive_name || certificate.drive_title || "Certificate of Completion",
    score: certificate.score === null || certificate.score === undefined ? null : normalizeNumber(certificate.score),
  };
};

export const issueCertificate = async ({ studentId, driveId, score: _passedScore, minScore: _legacyMinScore }) => {
  const student = await resolveStudentContext({ userId: studentId });
  const eligibility = await evaluateCertificateEligibility({ userId: student.user_id, driveId });

  if (!eligibility.eligible) {
    const error = new Error(
      `Certificate eligibility criteria not met. ${eligibility.unmetCriteria.join(" ")}`,
    );
    error.statusCode = 403;
    error.details = eligibility;
    throw error;
  }

  const existing = await pool.query(
    "SELECT * FROM certificates WHERE student_id = $1 AND drive_id = $2 LIMIT 1",
    [student.user_id, Number(driveId)],
  );
  if (existing.rows[0]) return existing.rows[0];

  const issuedAt = new Date();
  const verificationCode = await generateVerificationCode(issuedAt.getUTCFullYear());
  const verificationUrl = `${String(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}/verify/${encodeURIComponent(verificationCode)}`;
  const storageKey = `certificates/${issuedAt.getUTCFullYear()}/${verificationCode}.pdf`;
  const filename = getCertificateFilename(verificationCode);

  const pdfDetails = await generateCertificatePDF({
    studentName: eligibility.student.name,
    collegeName: eligibility.student.collegeName,
    driveName: eligibility.drive.name,
    companyName: eligibility.drive.companyName,
    skillDomain: eligibility.drive.skillDomain,
    score: eligibility.score.value,
    completionDate: issuedAt,
    verificationCode,
    verifyUrl: verificationUrl,
    mentorName: "Pragati Platform",
  });

  let storageProvider = "local";
  let certificateUrl = `/public/certificates/${pdfDetails.filename || filename}`;
  let persistedStorageKey = pdfDetails.relativePath || `public/certificates/${pdfDetails.filename || filename}`;

  try {
    if (isS3Configured()) {
      const pdfBuffer = await fs.readFile(pdfDetails.filePath);
      const stored = await uploadCertificate({
        key: storageKey,
        body: pdfBuffer,
        contentType: "application/pdf",
      });
      storageProvider = stored.provider;
      certificateUrl = stored.publicUrl;
      persistedStorageKey = storageKey;
    }

    const insertResult = await pool.query(
      `INSERT INTO certificates (
         student_id,
         drive_id,
         certificate_url,
         verify_uuid,
         verification_code,
         score,
         issued_at,
         storage_key,
         storage_provider,
         student_name,
         college_name,
         drive_name,
         company_name,
         skill_domain
       ) VALUES ($1, $2, $3, gen_random_uuid(), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        student.user_id,
        Number(driveId),
        certificateUrl,
        verificationCode,
        eligibility.score.value,
        issuedAt,
        persistedStorageKey,
        storageProvider,
        eligibility.student.name,
        eligibility.student.collegeName,
        eligibility.drive.name,
        eligibility.drive.companyName,
        eligibility.drive.skillDomain,
      ],
    );

    const certificate = insertResult.rows[0];

    try {
      await sendCertificateEmail({
        toEmail: student.email,
        studentName: eligibility.student.name,
        driveName: eligibility.drive.name,
        certificateUrl,
        verifyUrl: verificationUrl,
        pdfPath: pdfDetails.filePath,
      });
    } catch (mailError) {
      console.error("[certificate] Email delivery failed:", mailError.message);
    }

    try {
      await notificationService.sendNotification({
        userIds: [Number(student.user_id)],
        title: "Certificate issued",
        message: `Your completion certificate for ${eligibility.drive.name} is now available.`,
        type: notificationService.NOTIFICATION_TYPES.CERTIFICATE_ISSUED,
        linkUrl: `/student/certificates/${certificate.id}`,
      });
    } catch (notificationError) {
      console.error("[certificate] Notification delivery failed:", notificationError.message);
    }

    return certificate;
  } finally {
    if (storageProvider === "s3") {
      await fs.rm(pdfDetails.filePath, { force: true }).catch(() => {});
    }
  }
};

export const autoIssueCertificatesForStudent = async ({ userId, studentProfileId, reason = "eligibility-change" }) => {
  const student = await resolveStudentContext({ userId, studentProfileId });
  const driveRows = await pool.query(
    `SELECT d.id
       FROM recruitment_drives d
       JOIN student_drive_progress sdp ON sdp.drive_id = d.id
      WHERE sdp.student_id = $1
        AND LOWER(d.status) = 'completed'
      ORDER BY d.id DESC`,
    [student.student_id],
  );

  const issued = [];
  for (const row of driveRows.rows) {
    const eligibility = await evaluateCertificateEligibility({
      userId: student.user_id,
      studentProfileId: student.student_id,
      driveId: row.id,
    });
    if (!eligibility.eligible) continue;

    try {
      const certificate = await issueCertificate({
        studentId: student.user_id,
        driveId: row.id,
      });
      issued.push(certificate);
    } catch (error) {
      if (error.code !== "23505") {
        console.error(`[certificate] Auto issuance failed (${reason}):`, error.message);
      }
    }
  }

  return issued;
};

export const getCertificateById = async (id) => {
  const result = await pool.query("SELECT * FROM certificates WHERE id = $1 LIMIT 1", [Number(id)]);
  return result.rows[0] || null;
};

export const getStudentCertificates = async (studentId, { apiBaseUrl, clientBaseUrl } = {}) => {
  const student = await resolveStudentContext({ userId: studentId });
  const result = await pool.query(
    `SELECT c.*,
            c.drive_name AS drive_title
       FROM certificates c
      WHERE c.student_id = $1
      ORDER BY c.issued_at DESC, c.id DESC`,
    [student.user_id],
  );
  return result.rows.map((certificate) => toPublicCertificate(certificate, { apiBaseUrl, clientBaseUrl }));
};

export const getStudentCertificate = async (studentId, certificateId, { apiBaseUrl, clientBaseUrl } = {}) => {
  const student = await resolveStudentContext({ userId: studentId });
  const result = await pool.query(
    `SELECT *
       FROM certificates
      WHERE id = $1
        AND student_id = $2
      LIMIT 1`,
    [Number(certificateId), student.user_id],
  );
  if (!result.rows[0]) return null;
  return toPublicCertificate(result.rows[0], { apiBaseUrl, clientBaseUrl });
};

export const getCertificateDownload = async (studentId, certificateId) => {
  const student = await resolveStudentContext({ userId: studentId });
  const result = await pool.query(
    `SELECT *
       FROM certificates
      WHERE id = $1
        AND student_id = $2
      LIMIT 1`,
    [Number(certificateId), student.user_id],
  );
  const certificate = result.rows[0];
  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }
  if (certificate.revoked) {
    const error = new Error("Certificate has been revoked");
    error.statusCode = 410;
    throw error;
  }

  if (certificate.storage_provider === "s3" && certificate.storage_key && isS3Configured()) {
    const signedUrl = createSignedDownloadUrl({ key: certificate.storage_key, expiresInSeconds: 3600 });
    if (!signedUrl) throw new Error("Certificate download storage is unavailable");
    return {
      type: "redirect",
      url: signedUrl,
      expiresIn: 3600,
      filename: getCertificateFilename(certificate.verification_code || certificate.verify_uuid),
    };
  }

  const storageKey = certificate.storage_key || String(certificate.certificate_url || "").replace(/^\/+/, "");
  const filePath = safeLocalCertificatePath(storageKey);
  try {
    await fs.access(filePath);
  } catch {
    const error = new Error("Certificate file not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    type: "file",
    filePath,
    expiresIn: null,
    filename: getCertificateFilename(certificate.verification_code || certificate.verify_uuid),
  };
};

export const verifyCertificateByCode = async (code) => {
  const normalized = clean(code);
  const result = await pool.query(
    `SELECT c.*,
            c.drive_name AS selected_drive_name
       FROM certificates c
      WHERE c.verification_code = $1
         OR c.verify_uuid::text = $1
      LIMIT 1`,
    [normalized],
  );
  const certificate = result.rows[0];
  if (!certificate) return null;
  return {
    valid: !certificate.revoked,
    revoked: Boolean(certificate.revoked),
    studentName: certificate.student_name || "Certificate holder",
    collegeName: certificate.college_name || "",
    driveName: certificate.drive_name || certificate.selected_drive_name || "Certificate of Completion",
    companyName: certificate.company_name || "",
    skillDomain: certificate.skill_domain || "Placement Training",
    issuedAt: certificate.issued_at,
    issuedBy: "Pragati Platform",
    verificationCode: certificate.verification_code || certificate.verify_uuid,
    score: certificate.score === null || certificate.score === undefined ? null : normalizeNumber(certificate.score),
    revokedAt: certificate.revoked_at || null,
  };
};

export const verifyCertificateByUuid = verifyCertificateByCode;

export const revokeCertificateById = async (id) => {
  const result = await pool.query(
    `UPDATE certificates
        SET revoked = true,
            revoked_at = NOW()
      WHERE id = $1
        AND revoked = false
      RETURNING *`,
    [Number(id)],
  );
  return result.rows[0] || null;
};

export default {
  evaluateCertificateEligibility,
  validateCompletionCriteria,
  issueCertificate,
  autoIssueCertificatesForStudent,
  getCertificateById,
  getStudentCertificates,
  getStudentCertificate,
  getCertificateDownload,
  verifyCertificateByCode,
  verifyCertificateByUuid,
  revokeCertificateById,
};
