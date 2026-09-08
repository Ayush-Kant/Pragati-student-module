import { pool } from "../config/db.js";
import {
  getStudentCertificates,
  getStudentCertificate,
  getCertificateDownload,
  evaluateCertificateEligibility,
} from "../services/certificate.service.js";

const getAuthenticatedStudent = (req) => {
  const userId = Number(req.user?.id ?? req.user?.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error("Authenticated student is invalid");
    error.statusCode = 401;
    throw error;
  }
  return userId;
};

export const listCertificates = async (req, res, next) => {
  try {
    const userId = getAuthenticatedStudent(req);
    const apiBaseUrl = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
    const certificates = await getStudentCertificates(userId, {
      apiBaseUrl,
      clientBaseUrl: process.env.CLIENT_URL,
    });
    if (!certificates.length) {
      return res.status(404).json({ success: false, message: "No certificates earned yet" });
    }
    return res.json({ success: true, certificates, data: certificates });
  } catch (error) {
    return next(error);
  }
};

export const getCertificate = async (req, res, next) => {
  try {
    const userId = getAuthenticatedStudent(req);
    const certificateId = Number(req.params.certificateId);
    if (!Number.isInteger(certificateId) || certificateId <= 0) {
      return res.status(400).json({ success: false, message: "certificateId must be a positive integer" });
    }

    const apiBaseUrl = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
    const certificate = await getStudentCertificate(userId, certificateId, {
      apiBaseUrl,
      clientBaseUrl: process.env.CLIENT_URL,
    });
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }
    return res.json({ success: true, certificate, data: certificate });
  } catch (error) {
    return next(error);
  }
};

export const downloadCertificate = async (req, res, next) => {
  try {
    const userId = getAuthenticatedStudent(req);
    const certificateId = Number(req.params.certificateId);
    if (!Number.isInteger(certificateId) || certificateId <= 0) {
      return res.status(400).json({ success: false, message: "certificateId must be a positive integer" });
    }

    const download = await getCertificateDownload(userId, certificateId);
    if (download.type === "redirect") {
      return res.status(200).json({
        success: true,
        downloadUrl: download.url,
        expiresIn: download.expiresIn,
        filename: download.filename,
      });
    }

    return res.download(download.filePath, download.filename);
  } catch (error) {
    return next(error);
  }
};

export const getEligibility = async (req, res, next) => {
  try {
    const userId = getAuthenticatedStudent(req);
    const driveId = req.query?.driveId ? Number(req.query.driveId) : null;

    if (driveId) {
      const result = await evaluateCertificateEligibility({ userId, driveId });
      return res.json({ success: true, data: result, eligibility: result });
    }

    const { rows } = await pool.query(
      `SELECT DISTINCT sdp.drive_id
         FROM student_drive_progress sdp
        JOIN students s ON s.id = sdp.student_id
        WHERE s.user_id = $1
        ORDER BY sdp.drive_id DESC`,
      [userId],
    );

    const evaluations = [];
    for (const row of rows) {
      evaluations.push(await evaluateCertificateEligibility({ userId, driveId: row.drive_id }));
    }
    const preferred = evaluations.find((item) => item.eligible) || evaluations[0] || null;

    const data = preferred
      ? {
          ...preferred,
          eligible: evaluations.some((item) => item.eligible),
          drives: evaluations,
          // Legacy presentation fields retained for the existing student UI.
          courseCompletion: preferred.submissions.complete,
          assessmentCompletion: preferred.score.complete,
          projectCompletion: preferred.submissions.complete,
        }
      : {
          eligible: false,
          drives: [],
          courseCompletion: false,
          assessmentCompletion: false,
          projectCompletion: false,
          score: { value: 0, required: 70, complete: false, source: "no_drive" },
          submissions: { requiredCount: 0, submittedCount: 0, complete: true, source: "no_drive" },
          attendance: { totalSessions: 0, attendedSessions: 0, attendancePercent: 100, requiredAttendance: 60, complete: true },
          driveCompleted: false,
          unmetCriteria: ["No recruitment drive is associated with this student account."],
        };

    return res.json({ success: true, data, eligibility: data });
  } catch (error) {
    return next(error);
  }
};
