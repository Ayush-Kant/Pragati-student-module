import { useCallback, useEffect, useState } from "react";

import { getCertificateEligibility } from "../services/certificateService";

import {
  REQUEST_STATUS,
  CERTIFICATE_MESSAGES,
} from "../constants/certificateConstants";

/**
 * Manage certificate eligibility data.
 *
 * Responsibilities:
 * - Fetch certificate eligibility
 * - Manage loading state
 * - Manage error state
 * - Expose eligibility data
 * - Support retry/refetch
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
 * @param {{ autoFetch?: boolean }} options
 *
 * @returns {{
 *   eligibility: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   status: string,
 *   refetch: Function
 * }}
 */
const useCertificateEligibility = (
  { autoFetch = true } = {}
) => {
  const [eligibility, setEligibility] =
    useState(null);

  const [status, setStatus] = useState(
    REQUEST_STATUS.IDLE
  );

  const [error, setError] =
    useState(null);

  /**
   * Fetch certificate eligibility.
   */
  const fetchEligibility =
    useCallback(async () => {
      setStatus(REQUEST_STATUS.LOADING);
      setError(null);

      try {
        const response =
          await getCertificateEligibility();

        const result =
          response?.eligibility || null;

        setEligibility(result);
        setStatus(
          REQUEST_STATUS.SUCCESS
        );

        return result;
      } catch (serviceError) {
        const message =
          serviceError?.message ||
          CERTIFICATE_MESSAGES.ELIGIBILITY_ERROR;

        setEligibility(null);
        setError(message);
        setStatus(
          REQUEST_STATUS.ERROR
        );

        return null;
      }
    }, []);

  /**
   * Automatically fetch eligibility when the hook
   * is mounted.
   */
  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchEligibility();
  }, [
    autoFetch,
    fetchEligibility,
  ]);

  /**
   * Retry eligibility request.
   */
  const refetch = useCallback(
    async () => {
      return fetchEligibility();
    },
    [fetchEligibility]
  );

  return {
    eligibility,

    loading:
      status === REQUEST_STATUS.LOADING,

    error,

    status,

    refetch,
  };
};

export default useCertificateEligibility;