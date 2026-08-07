import { useState, useEffect, useCallback } from 'react';
import { studentProfileService } from '../../services/studentProfileService';

/**
 * Custom hook for managing student profile data.
 * Handles fetching, updating, and editing state for the student profile.
 * @returns {{
 *   profile: object|null,
 *   loading: boolean,
 *   error: string|null,
 *   isEditing: boolean,
 *   updateProfile: Function,
 *   startEditing: Function,
 *   cancelEditing: Function,
 *   refetch: Function
 * }}
 */
export const useStudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Fetches the student profile data from the service.
   * @returns {Promise<void>}
   */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentProfileService.getStudentProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the profile');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates the student profile with the provided data.
   * @param {Object} data - The profile data to update
   * @returns {Promise<{success: boolean, data: object, error: string|null}>}
   */
  const updateProfile = useCallback(async (data) => {
    try {
      const response = await studentProfileService.updateStudentProfile(data);
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error || 'Failed to update profile' };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while updating the profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Sets isEditing to true to enable profile editing mode.
   */
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  /**
   * Sets isEditing to false to cancel profile editing mode.
   */
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    isEditing,
    updateProfile,
    startEditing,
    cancelEditing,
    refetch: fetchProfile
  };
};