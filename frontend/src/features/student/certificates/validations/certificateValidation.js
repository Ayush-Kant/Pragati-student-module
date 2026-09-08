import {
  CERTIFICATE_ID_CONFIG,
  ELIGIBILITY_CRITERIA,
} from "../constants/certificateConstants";

export const validateCertificateId = (certificateId) => {
  const value = certificateId === null || certificateId === undefined ? "" : String(certificateId).trim();
  if (!value) return { isValid: false, message: "Certificate ID is required.", value: "" };
  if (value.length < CERTIFICATE_ID_CONFIG.MIN_LENGTH || value.length > CERTIFICATE_ID_CONFIG.MAX_LENGTH) {
    return { isValid: false, message: `Certificate ID must be between ${CERTIFICATE_ID_CONFIG.MIN_LENGTH} and ${CERTIFICATE_ID_CONFIG.MAX_LENGTH} characters.`, value };
  }
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return { isValid: false, message: "Certificate ID can contain only letters, numbers, hyphens, and underscores.", value };
  }
  return { isValid: true, message: "", value: value.toUpperCase() };
};

export const validateVerificationRequest = (request = {}) => {
  const certificateValidation = validateCertificateId(request?.certificateId);
  const errors = {};
  if (!certificateValidation.isValid) errors.certificateId = certificateValidation.message;
  return { isValid: Object.keys(errors).length === 0, errors, value: { certificateId: certificateValidation.value } };
};

export const validateDownloadRequest = (request = {}) => {
  const errors = {};
  const certificate = request?.certificate || null;
  const certificateId = request?.certificateId ?? certificate?.id ?? "";
  const normalizedCertificateId = String(certificateId).trim();

  // Download endpoints use the database certificate primary key, which is numeric.
  // Keep this validation separate from the public verification-code rules above.
  if (!/^\d+$/.test(normalizedCertificateId) || Number(normalizedCertificateId) <= 0) {
    errors.certificateId = "Certificate ID must be a positive integer.";
  }
  if (!certificate) {
    errors.certificate = "Certificate information is required to download the certificate.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: { certificateId: normalizedCertificateId, certificate },
  };
};

export const validateEligibilityData = (eligibility = {}) => {
  const errors = {};
  const criteria = [
    { key: ELIGIBILITY_CRITERIA.COURSE, label: "Course completion" },
    { key: ELIGIBILITY_CRITERIA.ASSESSMENT, label: "Assessment completion" },
    { key: ELIGIBILITY_CRITERIA.PROJECT, label: "Project completion" },
  ];
  criteria.forEach(({ key, label }) => {
    const value = Number(eligibility?.[key]);
    if (!Number.isFinite(value)) errors[key] = `${label} must be a valid percentage.`;
    else if (value < 0 || value > 100) errors[key] = `${label} must be between 0 and 100.`;
  });
  if (typeof eligibility?.eligible !== "boolean") errors.eligible = "Eligibility status must be a boolean value.";
  return { isValid: Object.keys(errors).length === 0, errors, value: eligibility };
};

export const validateCertificate = (certificate = {}) => {
  const errors = {};
  const idValidation = validateCertificateId(certificate?.id);
  if (!idValidation.isValid) errors.id = idValidation.message;
  if (!certificate?.title || !String(certificate.title).trim()) errors.title = "Certificate title is required.";
  if (!certificate?.issueDate) errors.issueDate = "Certificate issue date is required.";
  if (!certificate?.status) errors.status = "Certificate status is required.";
  if (!certificate?.verificationStatus) errors.verificationStatus = "Certificate verification status is required.";
  return { isValid: Object.keys(errors).length === 0, errors, value: { ...certificate, id: idValidation.value } };
};

export const validateCertificateLookup = (certificateId) => validateCertificateId(certificateId);

export const getFirstValidationError = (errors = {}, fallback = "Please check the entered information.") => {
  const messages = Object.values(errors).filter(Boolean);
  return messages.length > 0 ? messages[0] : fallback;
};
