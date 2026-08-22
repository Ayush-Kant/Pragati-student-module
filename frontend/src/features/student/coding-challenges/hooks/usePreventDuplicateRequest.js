import { useCallback, useRef } from 'react';

/**
 * Wraps an async function so that only one invocation runs at a time.
 * Subsequent calls while the previous is in-flight are silently ignored.
 *
 * This prevents duplicate submissions triggered by rapid button clicks.
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} fn - The async function to guard.
 * @returns {(...args: any[]) => Promise<T | undefined>} Guarded async function.
 *
 * @example
 * const safeSubmit = usePreventDuplicateRequest(handleSubmit);
 * <button onClick={safeSubmit}>Submit</button>
 */
export function usePreventDuplicateRequest(fn) {
  const inFlightRef = useRef(false);

  return useCallback(
    async (...args) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        return await fn(...args);
      } finally {
        inFlightRef.current = false;
      }
    },
    [fn]
  );
}
