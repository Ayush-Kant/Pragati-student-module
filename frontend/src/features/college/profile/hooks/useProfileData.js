import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';

/**
 * Custom hook controlling college profile lifecycles, operational states, and manual view updates.
 * @returns {Object} { data, isLoading, error, refetch } control hooks
 */
export const useProfileData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. useCallback keeps this function reference identical across renders
  const loadProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await profileService.fetchCollegeProfile();
      setData(result);
    } catch (err) {
      setError(err.message || 'An unexpected failure occurred while fetching profile records.');
    } finally {
      setIsLoading(false);
    }
  }, []); // 🌟 Empty dependency array here keeps the function identity stable

  // 2. We use an empty array [] here so it only triggers ONCE on page mount
  useEffect(() => {
    loadProfileData();
  }, []); // 🌟 Changing this to [] stops it from ever listening to LoginPage re-renders

  return {
    data,
    isLoading,
    error,
    refetch: loadProfileData
  };
};