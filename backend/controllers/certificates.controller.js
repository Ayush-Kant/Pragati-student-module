import {
  issueCertificate,
  getCertificateById,
  verifyCertificateByCode,
  revokeCertificateById,
} from "../services/certificate.service.js";
import { triggerBadgeEvaluation } from "../jobs/badgeEvaluation.job.js";

const getRequestUserId = (req) => Number(req.user?.id ?? req.user?.userId);

export const generateCertificate = async (req, res) => {
  try {
    const { studentId, driveId } = req.body;

    if (!studentId || !driveId) {
      return res.status(400).json({
        success: false,
        message: "studentId and driveId are required",
      });
    }

    // The certificate service always recomputes the authoritative eligibility
    // score and drive thresholds. Client-provided score/minScore values are
    // intentionally ignored so they cannot be used to mint an invalid cert.
    const certificate = await issueCertificate({
      studentId: Number(studentId),
      driveId: Number(driveId),
    });

    try {
      await triggerBadgeEvaluation(studentId);
    } catch (jobErr) {
      console.error("Non-fatal: Failed to run badge evaluation job after certificate generation:", jobErr);
    }

    return res.status(201).json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Failed to generate certificate",
      details: error.details || undefined,
    });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await getCertificateById(Number(id));

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const userId = getRequestUserId(req);
    const isOwner = certificate.student_id === userId;
    const isPrivileged = ["admin", "mentor"].includes(req.user?.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view this certificate",
      });
    }

    return res.status(200).json({
      success: true,
      certificate,
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
    const verificationCode = req.params.verificationCode || req.params.uuid || req.params.code;
    if (!verificationCode) {
      return res.status(400).json({ valid: false, message: "Verification code is required" });
    }

    const certificate = await verifyCertificateByCode(verificationCode);
    if (!certificate) {
      return res.status(404).json({
        valid: false,
        verified: false,
        message: "No certificate found for this verification code",
      });
    }

    if (certificate.revoked) {
      return res.status(410).json({
        valid: false,
        verified: false,
        message: "Certificate has been revoked",
        verificationCode: certificate.verificationCode,
      });
    }

    return res.status(200).json({
      valid: true,
      verified: true,
      studentName: certificate.studentName,
      collegeName: certificate.collegeName,
      driveName: certificate.driveName,
      companyName: certificate.companyName,
      skillDomain: certificate.skillDomain,
      issuedAt: certificate.issuedAt,
      issuedBy: certificate.issuedBy,
      verificationCode: certificate.verificationCode,
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return res.status(500).json({
      valid: false,
      verified: false,
      message: "Internal Server Error",
    });
  }
};

export const revokeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await revokeCertificateById(Number(id));

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
