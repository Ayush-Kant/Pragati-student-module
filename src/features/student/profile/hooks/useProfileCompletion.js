import { useState, useEffect, useCallback } from 'react';
import { studentProfileService } from '../../services/studentProfileService';
import { calculateProfileCompletion, getMissingFields } from '../../utils/studentProfileHelpers';

/**
 * Custom hook for managing profile completion tracking.
 * Fetches completion data on mount and provides helpers for calculating
 * completion percentage and identifying missing fields.
 * @param {object} profile - The student profile object
 * @returns {{
 *   completion: number,
 *   loading: boolean,
 *   error: string|null,
 *   calculateCompletion: Function,
 *   getMissingFields: Function,
 *   refetch: Function
 * }}
 */
export const useProfileCompletion = (profile) => {
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Calculates the profile completion percentage using the helper function.
   * @param {object} profileData - The student profile object
   * @returns {number} Completion percentage (0-100)
   */
  const calcCompletion = useCallback((profileData) => {
    if (!profileData) return 0;
    return calculateProfileCompletion(profileData);
  }, []);

  /**
   * Gets the list of missing required fields using the helper function.
   * @param {object} profileData - The student profile object
   * @returns {Array<{section: string, field: string, label: string}>} Array of missing field objects
   */
  const getMissing = useCallback((profileData) => {
    if (!profileData) return [];
    return getMissingFields(profileData);
  }, []);

  /**
   * Fetches the profile completion data from the service.
   * @returns {Promise<void>}
   */
  const fetchCompletion = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentProfileService.getProfileCompletion();
      if (response.success) {
        setCompletion(response.data.percentage);
      } else {
        setError(response.error || 'Failed to fetch completion data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching completion data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompletion();
  }, [fetchCompletion]);

  return {
    completion,
    loading,
    error,
    calculateCompletion: calcCompletion,
    getMissingFields: getMissing,
    refetch: fetchCompletion
  };
};