import { useCallback, useEffect, useState } from "react";

import {
  getCertificates,
  getCertificateHistory,
  getDownloadHistory,
} from "../services/certificateService";

import { REQUEST_STATUS } from "../constants/certificateConstants";

/**
 * Manage earned certificates and certificate history.
 *
 * Responsibilities:
 * - Fetch certificate listing
 * - Fetch certificate history
 * - Fetch download history
 * - Manage loading states
 * - Manage error states
 * - Provide retry/refetch actions
 *
 * @returns {{
 *   certificates: Array,
 *   history: Array,
 *   downloadHistory: Array,
 *   loading: boolean,
 *   historyLoading: boolean,
 *   downloadHistoryLoading: boolean,
 *   error: string|null,
 *   historyError: string|null,
 *   downloadHistoryError: string|null,
 *   status: string,
 *   historyStatus: string,
 *   downloadHistoryStatus: string,
 *   refetch: Function,
 *   refetchHistory: Function,
 *   refetchDownloadHistory: Function
 * }}
 */
const useCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [history, setHistory] = useState([]);
  const [downloadHistory, setDownloadHistory] =
    useState([]);

  const [status, setStatus] = useState(
    REQUEST_STATUS.IDLE
  );

  const [historyStatus, setHistoryStatus] =
    useState(REQUEST_STATUS.IDLE);

  const [
    downloadHistoryStatus,
    setDownloadHistoryStatus,
  ] = useState(REQUEST_STATUS.IDLE);

  const [error, setError] = useState(null);
  const [historyError, setHistoryError] =
    useState(null);

  const [
    downloadHistoryError,
    setDownloadHistoryError,
  ] = useState(null);

  /**
   * Fetch earned certificates.
   */
  const fetchCertificates = useCallback(
    async () => {
      setStatus(REQUEST_STATUS.LOADING);
      setError(null);

      try {
        const response =
          await getCertificates();

        setCertificates(
          Array.isArray(
            response?.certificates
          )
            ? response.certificates
            : []
        );

        setStatus(
          REQUEST_STATUS.SUCCESS
        );

        return response;
      } catch (serviceError) {
        const message =
          serviceError?.message ||
          "Unable to load certificates. Please try again.";

        setCertificates([]);
        setError(message);
        setStatus(
          REQUEST_STATUS.ERROR
        );

        throw serviceError;
      }
    },
    []
  );

  /**
   * Fetch certificate history.
   */
  const fetchHistory = useCallback(
    async () => {
      setHistoryStatus(
        REQUEST_STATUS.LOADING
      );
      setHistoryError(null);

      try {
        const response =
          await getCertificateHistory();

        setHistory(
          Array.isArray(
            response?.history
          )
            ? response.history
            : []
        );

        setHistoryStatus(
          REQUEST_STATUS.SUCCESS
        );

        return response;
      } catch (serviceError) {
        const message =
          serviceError?.message ||
          "Unable to load certificate history. Please try again.";

        setHistory([]);
        setHistoryError(message);
        setHistoryStatus(
          REQUEST_STATUS.ERROR
        );

        throw serviceError;
      }
    },
    []
  );

  /**
   * Fetch certificate download history.
   */
  const fetchDownloadHistory =
    useCallback(async () => {
      setDownloadHistoryStatus(
        REQUEST_STATUS.LOADING
      );
      setDownloadHistoryError(null);

      try {
        const response =
          await getDownloadHistory();

        setDownloadHistory(
          Array.isArray(
            response?.history
          )
            ? response.history
            : []
        );

        setDownloadHistoryStatus(
          REQUEST_STATUS.SUCCESS
        );

        return response;
      } catch (serviceError) {
        const message =
          serviceError?.message ||
          "Unable to load download history. Please try again.";

        setDownloadHistory([]);
        setDownloadHistoryError(
          message
        );

        setDownloadHistoryStatus(
          REQUEST_STATUS.ERROR
        );

        throw serviceError;
      }
    }, []);

  /**
   * Fetch certificates and related history.
   *
   * Each request is handled independently so a failure
   * in history does not prevent the certificate listing
   * from being displayed.
   */
  const fetchAll = useCallback(
    async () => {
      const results =
        await Promise.allSettled([
          fetchCertificates(),
          fetchHistory(),
          fetchDownloadHistory(),
        ]);

      return results;
    },
    [
      fetchCertificates,
      fetchHistory,
      fetchDownloadHistory,
    ]
  );

  /**
   * Initial data fetch.
   */
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /**
   * Retry certificate listing.
   */
  const refetch = useCallback(
    async () => {
      return fetchCertificates();
    },
    [fetchCertificates]
  );

  /**
   * Retry certificate history.
   */
  const refetchHistory = useCallback(
    async () => {
      return fetchHistory();
    },
    [fetchHistory]
  );

  /**
   * Retry certificate download history.
   */
  const refetchDownloadHistory =
    useCallback(async () => {
      return fetchDownloadHistory();
    }, [fetchDownloadHistory]);

  return {
    certificates,
    history,
    downloadHistory,

    loading:
      status === REQUEST_STATUS.LOADING,

    historyLoading:
      historyStatus ===
      REQUEST_STATUS.LOADING,

    downloadHistoryLoading:
      downloadHistoryStatus ===
      REQUEST_STATUS.LOADING,

    error,
    historyError,
    downloadHistoryError,

    status,
    historyStatus,
    downloadHistoryStatus,

    refetch,
    refetchHistory,
    refetchDownloadHistory,
  };
};

export default useCertificates;