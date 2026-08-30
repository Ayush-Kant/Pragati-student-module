import {
  CERTIFICATE_ID_CONFIG,
  ELIGIBILITY_CRITERIA,
} from "../constants/certificateConstants";

/**
 * Validate a certificate ID.
 *
 * Rules:
 * - Certificate ID is required.
 * - ID must satisfy the configured length range.
 * - ID may contain letters, numbers, hyphens, and underscores.
 * - Returned value is normalized to uppercase.
 *
 * @param {string} certificateId
 * @returns {{
 *   isValid: boolean,
 *   message: string,
 *   value: string
 * }}
 */
export const validateCertificateId = (certificateId) => {
  const value =
    certificateId === null ||
    certificateId === undefined
      ? ""
      : String(certificateId).trim();

  if (!value) {
    return {
      isValid: false,
      message: "Certificate ID is required.",
      value: "",
    };
  }

  if (
    value.length < CERTIFICATE_ID_CONFIG.MIN_LENGTH ||
    value.length > CERTIFICATE_ID_CONFIG.MAX_LENGTH
  ) {
    return {
      isValid: false,
      message: `Certificate ID must be between ${CERTIFICATE_ID_CONFIG.MIN_LENGTH} and ${CERTIFICATE_ID_CONFIG.MAX_LENGTH} characters.`,
      value,
    };
  }

  const validFormat = /^[A-Za-z0-9_-]+$/.test(value);

  if (!validFormat) {
    return {
      isValid: false,
      message:
        "Certificate ID can contain only letters, numbers, hyphens, and underscores.",
      value,
    };
  }

  return {
    isValid: true,
    message: "",
    value: value.toUpperCase(),
  };
};

/**
 * Validate a certificate verification request.
 *
 * @param {Object} request
 * @param {string} request.certificateId
 * @returns {{
 *   isValid: boolean,
 *   errors: Object,
 *   value: Object
 * }}
 */
export const validateVerificationRequest = (
  request = {}
) => {
  const certificateValidation =
    validateCertificateId(request?.certificateId);

  const errors = {};

  if (!certificateValidation.isValid) {
    errors.certificateId =
      certificateValidation.message;
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    errors,
    value: {
      certificateId:
        certificateValidation.value,
    },
  };
};

/**
 * Validate a certificate download request.
 *
 * The approved certificate dummy structure contains:
 * - id
 * - title
 * - issueDate
 * - status
 * - verificationStatus
 *
 * Therefore download validation only depends on the
 * certificate ID and certificate object being available.
 *
 * @param {Object} request
 * @param {Object} request.certificate
 * @param {string} request.certificateId
 * @returns {{
 *   isValid: boolean,
 *   errors: Object,
 *   value: Object
 * }}
 */
export const validateDownloadRequest = (
  request = {}
) => {
  const errors = {};

  const certificate =
    request?.certificate || null;

  const certificateId =
    request?.certificateId ||
    certificate?.id ||
    "";

  const certificateValidation =
    validateCertificateId(certificateId);

  if (!certificateValidation.isValid) {
    errors.certificateId =
      certificateValidation.message;
  }

  if (!certificate) {
    errors.certificate =
      "Certificate information is required to download the certificate.";
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    errors,
    value: {
      certificateId:
        certificateValidation.value,
      certificate,
    },
  };
};

/**
 * Validate certificate eligibility data.
 *
 * Expected eligibility structure:
 *
 * {
 *   courseCompletion: number,
 *   assessmentCompletion: number,
 *   projectCompletion: number,
 *   eligible: boolean
 * }
 *
 * @param {Object} eligibility
 * @returns {{
 *   isValid: boolean,
 *   errors: Object,
 *   value: Object
 * }}
 */
export const validateEligibilityData = (
  eligibility = {}
) => {
  const errors = {};

  const criteria = [
    {
      key: ELIGIBILITY_CRITERIA.COURSE,
      label: "Course completion",
    },
    {
      key: ELIGIBILITY_CRITERIA.ASSESSMENT,
      label: "Assessment completion",
    },
    {
      key: ELIGIBILITY_CRITERIA.PROJECT,
      label: "Project completion",
    },
  ];

  criteria.forEach(({ key, label }) => {
    const value = Number(
      eligibility?.[key]
    );

    if (!Number.isFinite(value)) {
      errors[key] =
        `${label} must be a valid percentage.`;
      return;
    }

    if (value < 0 || value > 100) {
      errors[key] =
        `${label} must be between 0 and 100.`;
    }
  });

  if (
    typeof eligibility?.eligible !==
    "boolean"
  ) {
    errors.eligible =
      "Eligibility status must be a boolean value.";
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    errors,
    value: eligibility,
  };
};

/**
 * Validate a certificate object against the
 * approved dummy certificate structure.
 *
 * Required fields:
 * - id
 * - title
 * - issueDate
 * - status
 * - verificationStatus
 *
 * @param {Object} certificate
 * @returns {{
 *   isValid: boolean,
 *   errors: Object,
 *   value: Object
 * }}
 */
export const validateCertificate = (
  certificate = {}
) => {
  const errors = {};

  const idValidation =
    validateCertificateId(
      certificate?.id
    );

  if (!idValidation.isValid) {
    errors.id = idValidation.message;
  }

  if (
    !certificate?.title ||
    !String(certificate.title).trim()
  ) {
    errors.title =
      "Certificate title is required.";
  }

  if (!certificate?.issueDate) {
    errors.issueDate =
      "Certificate issue date is required.";
  }

  if (!certificate?.status) {
    errors.status =
      "Certificate status is required.";
  }

  if (!certificate?.verificationStatus) {
    errors.verificationStatus =
      "Certificate verification status is required.";
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    errors,
    value: {
      ...certificate,
      id: idValidation.value,
    },
  };
};

/**
 * Validate a certificate lookup request.
 *
 * Used when certificate ID comes from a route
 * parameter or another navigation source.
 *
 * @param {string} certificateId
 * @returns {{
 *   isValid: boolean,
 *   message: string,
 *   value: string
 * }}
 */
export const validateCertificateLookup = (
  certificateId
) => {
  return validateCertificateId(
    certificateId
  );
};

/**
 * Return the first available validation error.
 *
 * @param {Object} errors
 * @param {string} fallback
 * @returns {string}
 */
export const getFirstValidationError = (
  errors = {},
  fallback = "Please check the entered information."
) => {
  const messages = Object.values(errors)
    .filter(Boolean);

  return messages.length > 0
    ? messages[0]
    : fallback;
};