import { useCallback, useEffect, useState } from 'react';
import { getSubmissionHistory } from '../services/codingChallengeService';

/**
 * Fetches and manages submission history for a challenge or all challenges.
 *
 * @param {string | null} [challengeId]
 * @returns {{
 *   submissions: object[],
 *   isLoading: boolean,
 *   error: string | null,
 *   refetch: Function,
 * }}
 */
export function useSubmissionHistory(challengeId = null) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSubmissionHistory(challengeId);
      if (result.success) {
        setSubmissions(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load submission history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchSubmissions();
    })();
    return () => { cancelled = true; };
  }, [fetchSubmissions]);

  return {
    submissions,
    isLoading,
    error,
    refetch: fetchSubmissions,
  };
}
