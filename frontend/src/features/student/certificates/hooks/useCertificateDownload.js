import { useCallback, useState } from "react";

import { downloadCertificate } from "../services/certificateService";

import {
  REQUEST_STATUS,
  DOWNLOAD_STATUS,
  CERTIFICATE_MESSAGES,
} from "../constants/certificateConstants";

import {
  validateDownloadRequest,
} from "../validations/certificateValidation";

/**
 * Manage certificate download state and actions.
 *
 * Responsibilities:
 * - Validate download request
 * - Start certificate download
 * - Manage downloading state
 * - Manage success state
 * - Manage error state
 * - Expose retry/reset actions
 *
 * @returns {{
 *   status: string,
 *   downloadStatus: string,
 *   loading: boolean,
 *   success: boolean,
 *   error: string|null,
 *   validationErrors: Object,
 *   download: Function,
 *   reset: Function
 * }}
 */
const useCertificateDownload = () => {
  const [status, setStatus] = useState(
    REQUEST_STATUS.IDLE
  );

  const [downloadStatus, setDownloadStatus] =
    useState(DOWNLOAD_STATUS.IDLE);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [validationErrors, setValidationErrors] =
    useState({});

  /**
   * Download a certificate.
   *
   * The confirmation step belongs to the UI.
   * This hook performs the actual validated download
   * after the user confirms.
   *
   * @param {string} certificateId
   * @param {Object|null} certificate
   * @returns {Promise<Object|null>}
   */
  const download = useCallback(
    async (
      certificateId,
      certificate = null
    ) => {
      setStatus(REQUEST_STATUS.IDLE);
      setDownloadStatus(
        DOWNLOAD_STATUS.IDLE
      );
      setSuccess(false);
      setError(null);
      setValidationErrors({});

      const validation =
        validateDownloadRequest({
          certificateId,
          certificate,
        });

      if (!validation.isValid) {
        setValidationErrors(
          validation.errors
        );

        setStatus(
          REQUEST_STATUS.ERROR
        );

        setDownloadStatus(
          DOWNLOAD_STATUS.FAILED
        );

        return null;
      }

      setStatus(
        REQUEST_STATUS.LOADING
      );

      setDownloadStatus(
        DOWNLOAD_STATUS.DOWNLOADING
      );

      try {
        const response =
          await downloadCertificate(
            validation.value.certificateId
          );

        if (
          response?.success !== true
        ) {
          const message =
            response?.message ||
            CERTIFICATE_MESSAGES.DOWNLOAD_ERROR;

          setError(message);
          setSuccess(false);

          setStatus(
            REQUEST_STATUS.ERROR
          );

          setDownloadStatus(
            DOWNLOAD_STATUS.FAILED
          );

          return response;
        }

        setSuccess(true);
        setError(null);

        setStatus(
          REQUEST_STATUS.SUCCESS
        );

        setDownloadStatus(
          DOWNLOAD_STATUS.SUCCESS
        );

        return response;
      } catch (serviceError) {
        const message =
          serviceError?.message ||
          CERTIFICATE_MESSAGES.DOWNLOAD_ERROR;

        setSuccess(false);
        setError(message);

        setStatus(
          REQUEST_STATUS.ERROR
        );

        setDownloadStatus(
          DOWNLOAD_STATUS.FAILED
        );

        return null;
      }
    },
    []
  );

  /**
   * Reset the download state.
   */
  const reset = useCallback(() => {
    setStatus(
      REQUEST_STATUS.IDLE
    );

    setDownloadStatus(
      DOWNLOAD_STATUS.IDLE
    );

    setSuccess(false);
    setError(null);
    setValidationErrors({});
  }, []);

  return {
    status,
    downloadStatus,

    loading:
      status === REQUEST_STATUS.LOADING,

    success,
    error,
    validationErrors,

    download,
    reset,
  };
};

export default useCertificateDownload;