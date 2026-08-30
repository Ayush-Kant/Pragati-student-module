import { useCallback, useEffect, useState } from "react";
import { getCertificateById } from "../services/certificateService";
import {
  REQUEST_STATUS,
  CERTIFICATE_MESSAGES,
} from "../constants/certificateConstants";

/**
 * Manage the details of a single certificate.
 *
 * Responsibilities:
 * - Fetch certificate details by ID
 * - Manage loading state
 * - Manage error state
 * - Support retry/refetch
 *
 * @param {string} certificateId
 * @param {{ autoFetch?: boolean }} options
 *
 * @returns {{
 *   certificate: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   status: string,
 *   refetch: Function
 * }}
 */
const useCertificateDetails = (
  certificateId,
  { autoFetch = true } = {}
) => {
  const [certificate, setCertificate] =
    useState(null);

  const [status, setStatus] = useState(
    REQUEST_STATUS.IDLE
  );

  const [error, setError] =
    useState(null);

  const fetchCertificate = useCallback(
    async (id = certificateId) => {
      setStatus(REQUEST_STATUS.LOADING);
      setError(null);

      if (!id) {
        const message =
          CERTIFICATE_MESSAGES.CERTIFICATE_ID_REQUIRED;

        setCertificate(null);
        setError(message);
        setStatus(REQUEST_STATUS.ERROR);

        return null;
      }

      try {
        const response =
          await getCertificateById(id);

        const result =
          response?.certificate || null;

        setCertificate(result);
        setStatus(
          REQUEST_STATUS.SUCCESS
        );

        return result;
      } catch (serviceError) {
        const message =
          serviceError?.message ||
          CERTIFICATE_MESSAGES.DETAILS_ERROR;

        setCertificate(null);
        setError(message);
        setStatus(
          REQUEST_STATUS.ERROR
        );

        return null;
      }
    },
    [certificateId]
  );

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchCertificate();
  }, [
    autoFetch,
    fetchCertificate,
  ]);

  const refetch = useCallback(
    async () => {
      return fetchCertificate();
    },
    [fetchCertificate]
  );

  return {
    certificate,

    loading:
      status === REQUEST_STATUS.LOADING,

    error,

    status,

    refetch,
  };
};

export default useCertificateDetails;