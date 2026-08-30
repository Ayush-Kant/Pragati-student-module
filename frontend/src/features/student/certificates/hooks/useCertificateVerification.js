import { useCallback, useState } from "react";

import { verifyCertificate } from "../services/certificateService";

import {
  REQUEST_STATUS,
  CERTIFICATE_MESSAGES,
} from "../constants/certificateConstants";

import {
  validateVerificationRequest,
} from "../validations/certificateValidation";

/**
 * Manage certificate verification.
 *
 * Responsibilities:
 * - Accept Certificate ID
 * - Validate verification request
 * - Call verification service
 * - Manage loading state
 * - Manage verification result
 * - Handle invalid certificates
 * - Handle service errors
 * - Support retry
 *
 * @returns {{
 *   verificationResult: Object|null,
 *   certificate: Object|null,
 *   verified: boolean,
 *   loading: boolean,
 *   error: string|null,
 *   validationErrors: Object,
 *   status: string,
 *   verify: Function,
 *   reset: Function
 * }}
 */
const useCertificateVerification = () => {
  const [verificationResult, setVerificationResult] =
    useState(null);

  const [certificate, setCertificate] =
    useState(null);

  const [verified, setVerified] =
    useState(false);

  const [status, setStatus] = useState(
    REQUEST_STATUS.IDLE
  );

  const [error, setError] = useState(null);

  const [validationErrors, setValidationErrors] =
    useState({});

  /**
   * Verify a certificate using its Certificate ID.
   *
   * @param {string} certificateId
   * @returns {Promise<Object|null>}
   */
  const verify = useCallback(
    async (certificateId) => {
      setError(null);
      setValidationErrors({});
      setVerificationResult(null);
      setCertificate(null);
      setVerified(false);

      const validation =
        validateVerificationRequest({
          certificateId,
        });

      if (!validation.isValid) {
        setValidationErrors(
          validation.errors
        );

        setStatus(
          REQUEST_STATUS.ERROR
        );

        return null;
      }

      setStatus(
        REQUEST_STATUS.LOADING
      );

      try {
        const response =
          await verifyCertificate(
            validation.value.certificateId
          );

        setVerificationResult(response);

        setCertificate(
          response?.certificate || null
        );

        setVerified(
          response?.verified === true
        );

        /*
         * Invalid certificate is a valid verification response,
         * not necessarily an API/service failure.
         *
         * Example:
         * {
         *   success: false,
         *   verified: false,
         *   certificate: null
         * }
         */
        if (response?.success === false) {
          setStatus(
            REQUEST_STATUS.SUCCESS
          );

          return response;
        }

        setStatus(
          REQUEST_STATUS.SUCCESS
        );

        return response;
      } catch (serviceError) {
        const message =
          serviceError?.message ||
          CERTIFICATE_MESSAGES.VERIFICATION_ERROR;

        setVerificationResult(null);
        setCertificate(null);
        setVerified(false);
        setError(message);

        setStatus(
          REQUEST_STATUS.ERROR
        );

        return null;
      }
    },
    []
  );

  /**
   * Clear the current verification state.
   */
  const reset = useCallback(() => {
    setVerificationResult(null);
    setCertificate(null);
    setVerified(false);
    setError(null);
    setValidationErrors({});
    setStatus(
      REQUEST_STATUS.IDLE
    );
  }, []);

  return {
    verificationResult,
    certificate,
    verified,

    loading:
      status === REQUEST_STATUS.LOADING,

    error,
    validationErrors,

    status,

    verify,
    reset,
  };
};

export default useCertificateVerification;