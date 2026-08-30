import {
  CERTIFICATE_STATUS,
  VERIFICATION_STATUS,
  ELIGIBILITY_STATUS,
  ELIGIBILITY_CRITERIA,
  DOWNLOAD_STATUS,
  COMPLETION_THRESHOLD,
} from "../constants/certificateConstants";

/**
 * Safely format a certificate date for display.
 *
 * @param {string|Date|null|undefined} date
 * @returns {string}
 */
export const formatCertificateDate = (date) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Return a full readable date for certificate preview/details.
 *
 * @param {string|Date|null|undefined} date
 * @returns {string}
 */
export const formatCertificateDateLong = (date) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Normalize a completion percentage to the valid range 0-100.
 *
 * @param {number|string|null|undefined} value
 * @returns {number}
 */
export const normalizeCompletion = (value) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return Math.min(
    COMPLETION_THRESHOLD.MAXIMUM,
    Math.max(COMPLETION_THRESHOLD.MINIMUM === 100 ? 0 : 0, numericValue)
  );
};

/**
 * Format a completion percentage for display.
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export const formatCompletionPercentage = (value) => {
  return `${normalizeCompletion(value)}%`;
};

/**
 * Calculate the overall eligibility progress from the three required
 * completion criteria.
 *
 * @param {Object} eligibility
 * @param {number} eligibility.courseCompletion
 * @param {number} eligibility.assessmentCompletion
 * @param {number} eligibility.projectCompletion
 * @returns {number}
 */
export const calculateEligibilityProgress = (eligibility = {}) => {
  const courseCompletion = normalizeCompletion(
    eligibility[ELIGIBILITY_CRITERIA.COURSE]
  );

  const assessmentCompletion = normalizeCompletion(
    eligibility[ELIGIBILITY_CRITERIA.ASSESSMENT]
  );

  const projectCompletion = normalizeCompletion(
    eligibility[ELIGIBILITY_CRITERIA.PROJECT]
  );

  const total =
    courseCompletion + assessmentCompletion + projectCompletion;

  return Math.round(total / 3);
};

/**
 * Determine eligibility status from the eligibility data.
 *
 * @param {Object} eligibility
 * @returns {string}
 */
export const getEligibilityStatus = (eligibility = {}) => {
  if (eligibility.eligible === true) {
    return ELIGIBILITY_STATUS.ELIGIBLE;
  }

  const progress = calculateEligibilityProgress(eligibility);

  if (progress > 0 && progress < COMPLETION_THRESHOLD.MAXIMUM) {
    return ELIGIBILITY_STATUS.IN_PROGRESS;
  }

  return ELIGIBILITY_STATUS.NOT_ELIGIBLE;
};

/**
 * Return the individual eligibility criteria in a reusable structure.
 *
 * @param {Object} eligibility
 * @returns {Array<Object>}
 */
export const getEligibilityCriteria = (eligibility = {}) => {
  return [
    {
      key: ELIGIBILITY_CRITERIA.COURSE,
      label: "Course Completion",
      value: normalizeCompletion(
        eligibility[ELIGIBILITY_CRITERIA.COURSE]
      ),
    },
    {
      key: ELIGIBILITY_CRITERIA.ASSESSMENT,
      label: "Assessment Completion",
      value: normalizeCompletion(
        eligibility[ELIGIBILITY_CRITERIA.ASSESSMENT]
      ),
    },
    {
      key: ELIGIBILITY_CRITERIA.PROJECT,
      label: "Project Completion",
      value: normalizeCompletion(
        eligibility[ELIGIBILITY_CRITERIA.PROJECT]
      ),
    },
  ];
};

/**
 * Check whether the certificate has been issued.
 *
 * @param {Object|null|undefined} certificate
 * @returns {boolean}
 */
export const isCertificateIssued = (certificate) => {
  return certificate?.status === CERTIFICATE_STATUS.ISSUED;
};

/**
 * Check whether a certificate is currently pending.
 *
 * @param {Object|null|undefined} certificate
 * @returns {boolean}
 */
export const isCertificatePending = (certificate) => {
  return certificate?.status === CERTIFICATE_STATUS.PENDING;
};

/**
 * Check whether a certificate has been revoked.
 *
 * @param {Object|null|undefined} certificate
 * @returns {boolean}
 */
export const isCertificateRevoked = (certificate) => {
  return certificate?.status === CERTIFICATE_STATUS.REVOKED;
};

/**
 * Check whether a certificate has been successfully verified.
 *
 * @param {Object|null|undefined} certificate
 * @returns {boolean}
 */
export const isCertificateVerified = (certificate) => {
  return certificate?.verificationStatus === VERIFICATION_STATUS.VERIFIED;
};

/**
 * Return a normalized certificate status label.
 *
 * @param {string|null|undefined} status
 * @returns {string}
 */
export const getCertificateStatusLabel = (status) => {
  switch (status) {
    case CERTIFICATE_STATUS.ISSUED:
      return "Issued";

    case CERTIFICATE_STATUS.PENDING:
      return "Pending";

    case CERTIFICATE_STATUS.REVOKED:
      return "Revoked";

    default:
      return "Unknown";
  }
};

/**
 * Return a normalized verification status label.
 *
 * @param {string|null|undefined} status
 * @returns {string}
 */
export const getVerificationStatusLabel = (status) => {
  switch (status) {
    case VERIFICATION_STATUS.VERIFIED:
      return "Verified";

    case VERIFICATION_STATUS.UNVERIFIED:
      return "Unverified";

    case VERIFICATION_STATUS.INVALID:
      return "Invalid";

    default:
      return "Unknown";
  }
};

/**
 * Generate a safe certificate filename.
 *
 * Example:
 * Full Stack Web Development + CERT-001
 * -> Full-Stack-Web-Development-CERT-001.pdf
 *
 * @param {Object|null|undefined} certificate
 * @returns {string}
 */
export const getCertificateFileName = (certificate = {}) => {
  const title = String(certificate.title || "Certificate")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const certificateId = String(certificate.id || "Certificate")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-");

  const safeTitle = title || "Certificate";
  const safeId = certificateId || "Certificate";

  return `${safeTitle}-${safeId}.pdf`;
};

/**
 * Check whether a certificate is available for download.
 *
 * @param {Object|null|undefined} certificate
 * @returns {boolean}
 */
export const isDownloadAvailable = (certificate) => {
  if (!certificate) {
    return false;
  }

  if (certificate.download?.available === false) {
    return false;
  }

  return isCertificateIssued(certificate);
};

/**
 * Determine whether a download operation was successful.
 *
 * @param {string|null|undefined} status
 * @returns {boolean}
 */
export const isDownloadSuccessful = (status) => {
  return status === DOWNLOAD_STATUS.SUCCESS;
};

/**
 * Determine whether a download operation failed.
 *
 * @param {string|null|undefined} status
 * @returns {boolean}
 */
export const isDownloadFailed = (status) => {
  return status === DOWNLOAD_STATUS.FAILED;
};

/**
 * Find a certificate by ID from a certificate collection.
 *
 * @param {Array} certificates
 * @param {string} certificateId
 * @returns {Object|null}
 */
export const findCertificateById = (
  certificates = [],
  certificateId = ""
) => {
  if (!Array.isArray(certificates) || !certificateId) {
    return null;
  }

  const normalizedId = String(certificateId).trim().toLowerCase();

  return (
    certificates.find(
      (certificate) =>
        String(certificate?.id || "").trim().toLowerCase() ===
        normalizedId
    ) || null
  );
};

/**
 * Return the certificate ID in a normalized format.
 *
 * @param {string|null|undefined} certificateId
 * @returns {string}
 */
export const normalizeCertificateId = (certificateId) => {
  if (certificateId === null || certificateId === undefined) {
    return "";
  }

  return String(certificateId).trim().toUpperCase();
};

/**
 * Create a lightweight normalized certificate object.
 * This prevents UI components from repeatedly checking optional fields.
 *
 * @param {Object|null|undefined} certificate
 * @returns {Object|null}
 */
export const normalizeCertificate = (certificate) => {
  if (!certificate) {
    return null;
  }

  return {
    id: normalizeCertificateId(certificate.id),
    title: certificate.title || "Untitled Certificate",
    courseName: certificate.courseName || certificate.title || "N/A",
    description: certificate.description || "",
    issueDate: certificate.issueDate || null,
    status: certificate.status || CERTIFICATE_STATUS.PENDING,
    verificationStatus:
      certificate.verificationStatus ||
      VERIFICATION_STATUS.UNVERIFIED,

    student: {
      id: certificate.student?.id || "",
      name: certificate.student?.name || "N/A",
    },

    issuer: {
      name: certificate.issuer?.name || "N/A",
    },

    preview: {
      url: certificate.preview?.url || null,
    },

    download: {
      available:
        certificate.download?.available !== false,
    },
  };
};

/**
 * Normalize a certificate history item.
 *
 * @param {Object|null|undefined} historyItem
 * @returns {Object|null}
 */
export const normalizeHistoryItem = (historyItem) => {
  if (!historyItem) {
    return null;
  }

  return {
    id: historyItem.id || "",
    certificateId: normalizeCertificateId(
      historyItem.certificateId || historyItem.id
    ),
    title: historyItem.title || "Untitled Certificate",
    issueDate: historyItem.issueDate || null,
    status: historyItem.status || CERTIFICATE_STATUS.PENDING,
    verificationStatus:
      historyItem.verificationStatus ||
      VERIFICATION_STATUS.UNVERIFIED,
  };
};

/**
 * Normalize a download history item.
 *
 * @param {Object|null|undefined} downloadItem
 * @returns {Object|null}
 */
export const normalizeDownloadHistoryItem = (downloadItem) => {
  if (!downloadItem) {
    return null;
  }

  return {
    certificateId: normalizeCertificateId(downloadItem.certificateId),
    downloadedAt: downloadItem.downloadedAt || null,
    status: downloadItem.status || DOWNLOAD_STATUS.FAILED,
  };
};

/**
 * Return a list of valid certificates only.
 *
 * @param {Array} certificates
 * @returns {Array}
 */
export const normalizeCertificates = (certificates = []) => {
  if (!Array.isArray(certificates)) {
    return [];
  }

  return certificates
    .map(normalizeCertificate)
    .filter(Boolean);
};

/**
 * Return whether a certificate collection is empty.
 *
 * @param {Array} certificates
 * @returns {boolean}
 */
export const hasCertificates = (certificates = []) => {
  return Array.isArray(certificates) && certificates.length > 0;
};

/**
 * Return whether certificate history contains entries.
 *
 * @param {Array} history
 * @returns {boolean}
 */
export const hasCertificateHistory = (history = []) => {
  return Array.isArray(history) && history.length > 0;
};

/**
 * Return whether download history contains entries.
 *
 * @param {Array} history
 * @returns {boolean}
 */
export const hasDownloadHistory = (history = []) => {
  return Array.isArray(history) && history.length > 0;
};