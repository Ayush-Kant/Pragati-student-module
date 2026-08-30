import { jsPDF } from "jspdf";

import {
  certificates,
  certificateEligibility,
  certificateApiResponse,
} from "../types/certificateDummyData";

import {
  MOCK_API_CONFIG,
  DOWNLOAD_STATUS,
  CERTIFICATE_MESSAGES,
} from "../constants/certificateConstants";

import {
  normalizeCertificate,
  normalizeCertificates,
  normalizeCertificateId,
  getCertificateFileName,
} from "../utils/certificateHelpers";

import {
  validateCertificateId,
  validateDownloadRequest,
} from "../validations/certificateValidation";

/* -------------------------------------------------------------------------- */
/* Mock service helpers                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Simulates backend response latency.
 *
 * @param {*} data
 * @param {number} delay
 * @returns {Promise<*>}
 */
const simulateResponse = (
  data,
  delay = MOCK_API_CONFIG.DELAY
) => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

/**
 * Simulates an asynchronous service failure.
 *
 * @param {string} message
 * @param {number} delay
 * @returns {Promise<never>}
 */
const simulateError = (
  message,
  delay = MOCK_API_CONFIG.DELAY
) => {
  return new Promise((_, reject) => {
    window.setTimeout(() => {
      reject(new Error(message));
    }, delay);
  });
};

/**
 * Find a certificate in the approved dummy certificate collection.
 *
 * @param {string} certificateId
 * @returns {Object|null}
 */
const findMockCertificateById = (certificateId) => {
  const normalizedId =
    normalizeCertificateId(certificateId);

  if (!normalizedId || !Array.isArray(certificates)) {
    return null;
  }

  return (
    certificates.find(
      (certificate) =>
        normalizeCertificateId(certificate?.id) ===
        normalizedId
    ) || null
  );
};

/* -------------------------------------------------------------------------- */
/* Service-local mock responses                                               */
/* -------------------------------------------------------------------------- */

/**
 * These mocks intentionally remain inside the service layer because the
 * backend certificate contract is not finalized yet.
 *
 * They are NOT separate dummy-data files.
 */

const getMockCertificateDetails = (certificate) => {
  if (!certificate) {
    return null;
  }

  return {
    ...certificate,

    courseName:
      certificate.courseName ||
      certificate.title,

    description:
      "Successfully completed the certification requirements for this program.",

    student: {
      name: "Student",
    },

    issuer: {
      name: "Pragati",
    },
  };
};

const getMockCertificateHistory = () => {
  if (!Array.isArray(certificates)) {
    return [];
  }

  return certificates.map((certificate) => ({
    id: `HISTORY-${certificate.id}`,
    certificateId: certificate.id,
    title: certificate.title,
    issueDate: certificate.issueDate,
    status: certificate.status,
    verificationStatus:
      certificate.verificationStatus,
  }));
};

const getMockDownloadHistory = () => {
  if (!Array.isArray(certificates)) {
    return [];
  }

  return certificates.map((certificate) => ({
    certificateId: certificate.id,
    downloadedAt: certificate.issueDate,
    status: DOWNLOAD_STATUS.SUCCESS,
  }));
};

/* -------------------------------------------------------------------------- */
/* PDF generation                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Generate a mock PDF locally for frontend development.
 *
 * This exists only because the backend download contract is not finalized.
 *
 * @param {Object} certificate
 * @returns {{ blob: Blob, filename: string }}
 */
const generateMockCertificatePdf = (certificate) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const title =
    certificate?.title || "Certificate";

  const certificateId =
    certificate?.id || "N/A";

  const issueDate =
    certificate?.issueDate || "N/A";

  pdf.setDrawColor(37, 99, 235);
  pdf.setLineWidth(1.5);

  pdf.rect(
    10,
    10,
    pageWidth - 20,
    pageHeight - 20
  );

  pdf.setTextColor(37, 99, 235);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);

  pdf.text(
    "CERTIFICATE",
    pageWidth / 2,
    45,
    {
      align: "center",
    }
  );

  pdf.setTextColor(55, 65, 81);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);

  pdf.text(
    "This certificate is awarded for successful completion of",
    pageWidth / 2,
    70,
    {
      align: "center",
    }
  );

  pdf.setTextColor(17, 24, 39);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);

  const wrappedTitle = pdf.splitTextToSize(
    title,
    pageWidth - 80
  );

  pdf.text(
    wrappedTitle,
    pageWidth / 2,
    95,
    {
      align: "center",
    }
  );

  pdf.setTextColor(75, 85, 99);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  pdf.text(
    `Certificate ID: ${certificateId}`,
    30,
    pageHeight - 30
  );

  pdf.text(
    `Issue Date: ${issueDate}`,
    pageWidth - 30,
    pageHeight - 30,
    {
      align: "right",
    }
  );

  return {
    blob: pdf.output("blob"),
    filename:
      getCertificateFileName(certificate),
  };
};

/**
 * Trigger browser download for a Blob.
 *
 * @param {Blob} blob
 * @param {string} filename
 */
const triggerBrowserDownload = (
  blob,
  filename
) => {
  const objectUrl = URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
};

/* -------------------------------------------------------------------------- */
/* Required service functions                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Get all earned certificates.
 *
 * Future:
 * Replace this mock implementation with the real API call.
 *
 * @returns {Promise<Object>}
 */
export const getCertificates = async () => {
  if (!Array.isArray(certificates)) {
    return simulateError(
      CERTIFICATE_MESSAGES.FETCH_ERROR
    );
  }

  return simulateResponse({
    success:
      certificateApiResponse?.success === true,
    certificates:
      normalizeCertificates(certificates),
  });
};

/**
 * Get a certificate by ID.
 *
 * The current approved dummy data only contains the certificate
 * listing fields. Additional detail information is kept as a
 * service-level mock until the backend contract is finalized.
 *
 * @param {string} certificateId
 * @returns {Promise<Object>}
 */
export const getCertificateById = async (
  certificateId
) => {
  const validation =
    validateCertificateId(certificateId);

  if (!validation.isValid) {
    return simulateError(
      validation.message
    );
  }

  const certificate =
    findMockCertificateById(
      validation.value
    );

  if (!certificate) {
    return simulateError(
      CERTIFICATE_MESSAGES.CERTIFICATE_NOT_FOUND
    );
  }

  const details =
    getMockCertificateDetails(certificate);

  return simulateResponse({
    success: true,
    certificate:
      normalizeCertificate(details),
  });
};

/**
 * Get certificate eligibility.
 *
 * This uses the exact eligibility structure
 * provided by the captain.
 *
 * @returns {Promise<Object>}
 */
export const getCertificateEligibility =
  async () => {
    if (!certificateEligibility) {
      return simulateError(
        CERTIFICATE_MESSAGES.ELIGIBILITY_ERROR
      );
    }

    return simulateResponse({
      success: true,

      eligibility: {
        courseCompletion:
          certificateEligibility.courseCompletion,

        assessmentCompletion:
          certificateEligibility.assessmentCompletion,

        projectCompletion:
          certificateEligibility.projectCompletion,

        eligible:
          certificateEligibility.eligible,
      },
    });
  };

/**
 * Verify a certificate.
 *
 * Current mock behavior:
 * - Valid certificate ID + existing certificate => verified
 * - Valid certificate ID + missing certificate => invalid
 *
 * @param {string} certificateId
 * @returns {Promise<Object>}
 */
export const verifyCertificate = async (
  certificateId
) => {
  const validation =
    validateCertificateId(certificateId);

  if (!validation.isValid) {
    return simulateError(
      validation.message
    );
  }

  const certificate =
    findMockCertificateById(
      validation.value
    );

  if (!certificate) {
    return simulateResponse({
      success: false,
      verified: false,
      certificate: null,
      message:
        CERTIFICATE_MESSAGES.VERIFICATION_INVALID,
    });
  }

  const verified =
    certificate.verificationStatus ===
    "Verified";

  if (!verified) {
    return simulateResponse({
      success: false,
      verified: false,
      certificate:
        normalizeCertificate(
          certificate
        ),
      message:
        CERTIFICATE_MESSAGES.VERIFICATION_INVALID,
    });
  }

  return simulateResponse({
    success: true,
    verified: true,
    certificate:
      normalizeCertificate(
        certificate
      ),
    message:
      CERTIFICATE_MESSAGES.VERIFICATION_SUCCESS,
  });
};

/**
 * Download a certificate.
 *
 * Current mock behavior:
 * - validates certificate
 * - generates a local PDF
 * - triggers browser download
 *
 * Future:
 * Replace PDF generation with the backend download/blob response.
 *
 * @param {string} certificateId
 * @returns {Promise<Object>}
 */
export const downloadCertificate = async (
  certificateId
) => {
  const certificate =
    findMockCertificateById(
      certificateId
    );

  const validation =
    validateDownloadRequest({
      certificateId,
      certificate,
    });

  if (!validation.isValid) {
    const firstError =
      Object.values(
        validation.errors
      )[0];

    return simulateError(
      firstError ||
        CERTIFICATE_MESSAGES.DOWNLOAD_ERROR
    );
  }

  if (certificate.status !== "Issued") {
    return simulateError(
      "Only issued certificates can be downloaded."
    );
  }

  try {
    const normalizedCertificate =
      normalizeCertificate(
        certificate
      );

    const generatedPdf =
      generateMockCertificatePdf(
        normalizedCertificate
      );

    await simulateResponse(null);

    triggerBrowserDownload(
      generatedPdf.blob,
      generatedPdf.filename
    );

    return {
      success: true,
      certificateId:
        normalizedCertificate.id,
      status:
        DOWNLOAD_STATUS.SUCCESS,
      filename:
        generatedPdf.filename,
      message:
        CERTIFICATE_MESSAGES.DOWNLOAD_SUCCESS,
    };
  } catch (error) {
    console.error(
      "Certificate download error:",
      error
    );

    throw new Error(
      CERTIFICATE_MESSAGES.DOWNLOAD_ERROR
    );
  }
};

/**
 * Get certificate history.
 *
 * The task requires certificate history, but the captain-approved
 * dummy-data contract does not define a separate history export.
 * Therefore history is derived from the approved certificates array
 * inside the service layer.
 *
 * @returns {Promise<Object>}
 */
export const getCertificateHistory =
  async () => {
    if (!Array.isArray(certificates)) {
      return simulateError(
        CERTIFICATE_MESSAGES.HISTORY_ERROR
      );
    }

    return simulateResponse({
      success: true,
      history:
        getMockCertificateHistory(),
    });
  };

/**
 * Get download history.
 *
 * The task requires download history, but the approved
 * dummy-data contract does not define a separate download-history
 * export. It is therefore kept as a service-level mock.
 *
 * @returns {Promise<Object>}
 */
export const getDownloadHistory =
  async () => {
    if (!Array.isArray(certificates)) {
      return simulateError(
        CERTIFICATE_MESSAGES.HISTORY_ERROR
      );
    }

    return simulateResponse({
      success: true,
      history:
        getMockDownloadHistory(),
    });
  };