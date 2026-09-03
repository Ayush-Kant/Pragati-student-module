import { pool } from '../config/db.js';

export const listCertificates = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const result = await pool.query(
      `SELECT
         c.id,
         c.student_id AS "studentId",
         c.drive_id AS "driveId",
         c.certificate_url AS "certificateUrl",
         c.verify_uuid AS "verifyUuid",
         c.score,
         c.issued_at AS "issuedAt",
         c.revoked,
         d.title AS "driveTitle"
       FROM certificates c
       LEFT JOIN recruitment_drives d ON d.id = c.drive_id
       WHERE c.student_id = $1
       ORDER BY c.issued_at DESC`,
      [userId],
    );

    const host = `${req.protocol}://${req.get('host')}`;
    res.json({
      success: true,
      data: result.rows.map((certificate) => ({
        ...certificate,
        score: certificate.score === null ? null : Number(certificate.score),
        status: certificate.revoked ? 'Revoked' : 'Issued',
        title: certificate.driveTitle || 'Certificate of Completion',
        certificateUrl: certificate.certificateUrl?.startsWith('http')
          ? certificate.certificateUrl
          : `${host}${certificate.certificateUrl}`,
        verifyUrl: `${host}/api/v1/certificates/verify/${certificate.verifyUuid}`,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const certificateId = Number(req.params.certificateId);
    if (!Number.isInteger(certificateId) || certificateId <= 0) {
      const error = new Error('certificateId must be a positive integer');
      error.statusCode = 400;
      throw error;
    }

    const result = await pool.query(
      `SELECT
         c.id, c.student_id AS "studentId", c.drive_id AS "driveId",
         c.certificate_url AS "certificateUrl", c.verify_uuid AS "verifyUuid",
         c.score, c.issued_at AS "issuedAt", c.revoked,
         d.title AS "driveTitle", u.full_name AS "studentName"
       FROM certificates c
       JOIN users u ON u.id = c.student_id
       LEFT JOIN recruitment_drives d ON d.id = c.drive_id
       WHERE c.id = $1 AND c.student_id = $2
       LIMIT 1`,
      [certificateId, userId],
    );

    if (!result.rows[0]) {
      const error = new Error('Certificate not found');
      error.statusCode = 404;
      throw error;
    }

    const certificate = result.rows[0];
    const host = `${req.protocol}://${req.get('host')}`;
    res.json({
      success: true,
      data: {
        ...certificate,
        score: certificate.score === null ? null : Number(certificate.score),
        title: certificate.driveTitle || 'Certificate of Completion',
        status: certificate.revoked ? 'Revoked' : 'Issued',
        certificateUrl: certificate.certificateUrl?.startsWith('http')
          ? certificate.certificateUrl
          : `${host}${certificate.certificateUrl}`,
        verifyUrl: `${host}/api/v1/certificates/verify/${certificate.verifyUuid}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEligibility = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const result = await pool.query(
      `SELECT
         COUNT(DISTINCT CASE WHEN scp.progress = 100 THEN scp.course_id END)::int AS completed_courses,
         EXISTS (
           SELECT 1 FROM student_assessment_attempts saa
           WHERE saa.student_id = (SELECT id FROM students WHERE user_id = $1 LIMIT 1)
             AND saa.status IN ('submitted','auto_submitted')
         ) AS has_assessment,
         EXISTS (
           SELECT 1 FROM project_submissions ps
           WHERE ps.student_id = (SELECT id FROM students WHERE user_id = $1 LIMIT 1)
         ) AS has_project
       FROM student_course_progress scp
       WHERE scp.student_id = (SELECT id FROM students WHERE user_id = $1 LIMIT 1)`,
      [userId],
    );

    const row = result.rows[0] || {};
    const courseCompletion = Number(row.completed_courses || 0) > 0;
    const assessmentCompletion = row.has_assessment === true;
    const projectCompletion = row.has_project === true;

    res.json({
      success: true,
      data: {
        courseCompletion,
        assessmentCompletion,
        projectCompletion,
        eligible: courseCompletion && assessmentCompletion && projectCompletion,
      },
    });
  } catch (error) {
    next(error);
  }
};
