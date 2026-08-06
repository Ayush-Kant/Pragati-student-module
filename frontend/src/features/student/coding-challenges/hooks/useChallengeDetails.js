import { useCallback, useEffect, useState } from 'react';
import { getChallengeDetails } from '../services/codingChallengeService';

/**
 * Fetches and manages details for a single coding challenge.
 *
 * @param {string} challengeId
 * @returns {{
 *   challenge: object | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   refetch: Function,
 * }}
 */
export function useChallengeDetails(challengeId) {
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChallenge = useCallback(async () => {
    if (!challengeId) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await getChallengeDetails(challengeId);
      if (result.success) {
        setChallenge(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load challenge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchChallenge();
    })();
    return () => { cancelled = true; };
  }, [fetchChallenge]);

  return {
    challenge,
    isLoading,
    error,
    refetch: fetchChallenge,
  };
}
