import { useCallback, useEffect, useRef, useState } from 'react';
import { getLeaderboard } from '../services/codingChallengeService';

/**
 * Fetches and manages leaderboard data for a specific challenge or global.
 *
 * Safety: Uses AbortController to cancel in-flight requests on unmount,
 * and a fetchId counter to discard stale responses from concurrent requests.
 * Lint-safe: useEffect body only kicks off the request and returns cleanup;
 * all setState calls are inside .then()/.catch() callbacks.
 *
 * @param {string | null} [challengeId]
 */
export function useLeaderboard(challengeId = null) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchId = ++fetchIdRef.current;

    getLeaderboard(challengeId, abortController.signal)
      .then((result) => {
        if (fetchId !== fetchIdRef.current || abortController.signal.aborted) return;
        if (result.success) {
          setLeaderboard(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || fetchId !== fetchIdRef.current) return;
        setError('Failed to load leaderboard. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, [challengeId]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const abortController = new AbortController();
    const fetchId = ++fetchIdRef.current;

    getLeaderboard(challengeId, abortController.signal)
      .then((result) => {
        if (fetchId !== fetchIdRef.current || abortController.signal.aborted) return;
        if (result.success) {
          setLeaderboard(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || fetchId !== fetchIdRef.current) return;
        setError('Failed to load leaderboard. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, [challengeId]);

  return { leaderboard, isLoading, error, refetch };
}
