import { useCallback, useEffect, useRef, useState } from 'react';
import { getSubmissionHistory } from '../services/codingChallengeService';

/**
 * Fetches and manages submission history for a challenge or all challenges.
 *
 * Safety: Uses AbortController to cancel in-flight requests on unmount,
 * and a fetchId counter to discard stale responses from concurrent requests.
 * Lint-safe: useEffect body only kicks off the request and returns cleanup;
 * all setState calls are inside .then()/.catch() callbacks.
 *
 * @param {string | null} [challengeId]
 */
export function useSubmissionHistory(challengeId = null) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchId = ++fetchIdRef.current;

    getSubmissionHistory(challengeId, abortController.signal)
      .then((result) => {
        if (fetchId !== fetchIdRef.current || abortController.signal.aborted) return;
        if (result.success) {
          setSubmissions(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || fetchId !== fetchIdRef.current) return;
        setError('Failed to load submission history. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, [challengeId]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const abortController = new AbortController();
    const fetchId = ++fetchIdRef.current;

    getSubmissionHistory(challengeId, abortController.signal)
      .then((result) => {
        if (fetchId !== fetchIdRef.current || abortController.signal.aborted) return;
        if (result.success) {
          setSubmissions(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || fetchId !== fetchIdRef.current) return;
        setError('Failed to load submission history. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, [challengeId]);

  return { submissions, isLoading, error, refetch };
}
