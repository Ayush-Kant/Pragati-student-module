import { useCallback, useEffect, useState } from 'react';
import { getLeaderboard } from '../services/codingChallengeService';

/**
 * Fetches and manages leaderboard data.
 *
 * @param {string | null} [challengeId]
 * @returns {{
 *   leaderboard: object[],
 *   isLoading: boolean,
 *   error: string | null,
 *   refetch: Function,
 * }}
 */
export function useLeaderboard(challengeId = null) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getLeaderboard(challengeId);
      if (result.success) {
        setLeaderboard(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchLeaderboard();
    })();
    return () => { cancelled = true; };
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    isLoading,
    error,
    refetch: fetchLeaderboard,
  };
}
