// Certificate status values
export const CERTIFICATE_STATUS = {
  ISSUED: "Issued",
  PENDING: "Pending",
  REVOKED: "Revoked",
};

// Certificate verification status values
export const VERIFICATION_STATUS = {
  VERIFIED: "Verified",
  UNVERIFIED: "Unverified",
  INVALID: "Invalid",
};

// Certificate eligibility status values
export const ELIGIBILITY_STATUS = {
  ELIGIBLE: "Eligible",
  NOT_ELIGIBLE: "Not Eligible",
  IN_PROGRESS: "In Progress",
};

// Keys used by the eligibility object
export const ELIGIBILITY_CRITERIA = {
  COURSE: "courseCompletion",
  ASSESSMENT: "assessmentCompletion",
  PROJECT: "projectCompletion",
};

// Certificate ID validation configuration
export const CERTIFICATE_ID_CONFIG = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 50,
};

// Certificate download states
export const DOWNLOAD_STATUS = {
  IDLE: "Idle",
  DOWNLOADING: "Downloading",
  SUCCESS: "Success",
  FAILED: "Failed",
};

// General request states used by hooks
export const REQUEST_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// Verification request states
export const VERIFICATION_RESULT_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  FAILURE: "failure",
};

// Valid completion percentage range
export const COMPLETION_THRESHOLD = {
  MINIMUM: 0,
  MAXIMUM: 100,
};

// Mock service response delay
export const MOCK_API_CONFIG = {
  DELAY: 500,
};

// Certificate-related user-facing messages
export const CERTIFICATE_MESSAGES = {
  FETCH_ERROR:
    "Unable to load certificates. Please try again.",

  DETAILS_ERROR:
    "Unable to load certificate details. Please try again.",

  ELIGIBILITY_ERROR:
    "Unable to check certificate eligibility. Please try again.",

  HISTORY_ERROR:
    "Unable to load certificate history. Please try again.",

  DOWNLOAD_SUCCESS:
    "Certificate downloaded successfully.",

  DOWNLOAD_ERROR:
    "Unable to download the certificate. Please try again.",

  VERIFICATION_SUCCESS:
    "Certificate verified successfully.",

  VERIFICATION_INVALID:
    "The certificate could not be verified. Please check the Certificate ID.",

  VERIFICATION_ERROR:
    "Unable to verify the certificate. Please try again.",

  CERTIFICATE_NOT_FOUND:
    "Certificate not found.",

  NO_CERTIFICATES:
    "No certificates available yet.",

  NO_HISTORY:
    "No certificate history available.",

  NO_DOWNLOAD_HISTORY:
    "No download history available.",

  INVALID_CERTIFICATE_ID:
    "Please enter a valid Certificate ID.",

  CERTIFICATE_ID_REQUIRED:
    "Certificate ID is required.",
};