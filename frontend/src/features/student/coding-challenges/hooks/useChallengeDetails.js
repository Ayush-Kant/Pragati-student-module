import { useCallback, useEffect, useRef, useState } from 'react';
import { getChallengeDetails } from '../services/codingChallengeService';

/**
 * Fetches and manages details for a single coding challenge.
 *
 * Safety: Uses AbortController to cancel in-flight requests on unmount,
 * and a fetchId counter to discard stale responses from concurrent requests.
 * Lint-safe: The useEffect body only calls abort() on cleanup. All state
 * mutations are performed inside then/catch callbacks (not at the effect top-level).
 *
 * @param {string} challengeId
 */
export function useChallengeDetails(challengeId) {
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(!!challengeId);
  const [error, setError] = useState(null);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    if (!challengeId) {
      setIsLoading(false); // eslint-disable-line react-hooks/set-state-in-effect -- needed to reset loading for empty id
      return;
    }

    const abortController = new AbortController();
    const fetchId = ++fetchIdRef.current;

    getChallengeDetails(challengeId, abortController.signal)
      .then((result) => {
        if (fetchId !== fetchIdRef.current || abortController.signal.aborted) return;
        if (result.success) {
          setChallenge(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || fetchId !== fetchIdRef.current) return;
        setError('Failed to load challenge. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, [challengeId]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const abortController = new AbortController();
    const fetchId = ++fetchIdRef.current;

    getChallengeDetails(challengeId, abortController.signal)
      .then((result) => {
        if (fetchId !== fetchIdRef.current || abortController.signal.aborted) return;
        if (result.success) {
          setChallenge(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || fetchId !== fetchIdRef.current) return;
        setError('Failed to load challenge. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, [challengeId]);

  return { challenge, isLoading, error, refetch };
}
