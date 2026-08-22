import {
  issueCertificate,
  getCertificateById,
  verifyCertificateByUuid,
  revokeCertificateById,
} from "../services/certificate.service.js";
import { triggerBadgeEvaluation } from "../jobs/badgeEvaluation.job.js";

export const generateCertificate = async (req, res) => {
  try {
    const { studentId, driveId, score, minScore } = req.body;

    if (!studentId || !driveId) {
      return res.status(400).json({
        success: false,
        message: "studentId and driveId are required",
      });
    }

    const certificate = await issueCertificate({
      studentId: parseInt(studentId),
      driveId: parseInt(driveId),
      score: score !== undefined ? parseFloat(score) : undefined,
      minScore: minScore !== undefined ? parseFloat(minScore) : undefined,
    });

    // Run badge evaluation after a certificate is generated
    try {
      await triggerBadgeEvaluation(studentId);
    } catch (jobErr) {
      console.error(
        "Non-fatal: Failed to run badge evaluation job after certificate generation:",
        jobErr,
      );
    }

    return res.status(201).json({
      success: true,
      certificate: {
        id: certificate.id,
        studentId: certificate.student_id,
        driveId: certificate.drive_id,
        certificateUrl: certificate.certificate_url,
        verifyUuid: certificate.verify_uuid,
        score: certificate.score ? parseFloat(certificate.score) : null,
        issuedAt: certificate.issued_at,
        revoked: certificate.revoked,
      },
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to generate certificate",
    });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await getCertificateById(parseInt(id));

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // IDOR Fix: Ensure the user is the owner of the certificate, or an admin/mentor
    const isOwner = certificate.student_id === req.user.id;
    const isPrivileged = ["admin", "mentor"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view this certificate",
      });
    }

    return res.status(200).json({
      success: true,
      certificate: {
        id: certificate.id,
        studentId: certificate.student_id,
        driveId: certificate.drive_id,
        certificateUrl: certificate.certificate_url,
        verifyUuid: certificate.verify_uuid,
        score: certificate.score ? parseFloat(certificate.score) : null,
        issuedAt: certificate.issued_at,
        revoked: certificate.revoked,
      },
    });
  } catch (error) {
    console.error("Error retrieving certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { uuid } = req.params;
    const certificate = await verifyCertificateByUuid(uuid);

    if (!certificate) {
      return res.status(404).json({
        verified: false,
        message: "Certificate not found",
      });
    }

    if (certificate.revoked) {
      return res.status(200).json({
        verified: false,
        message: "Certificate Revoked",
      });
    }

    return res.status(200).json({
      verified: true,
      studentName: certificate.student_name,
      drive: certificate.drive_title,
      score: certificate.score ? parseFloat(certificate.score) : null,
      issuedAt: certificate.issued_at,
      revoked: false,
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return res.status(500).json({
      verified: false,
      message: "Internal Server Error",
    });
  }
};

export const revokeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await revokeCertificateById(parseInt(id));

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or already revoked",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
