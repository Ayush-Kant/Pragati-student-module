import { useState, useEffect, useCallback, useMemo } from "react";
import { getStudentProfile } from "../services/studentProfileService";
import { validateProfile } from "../validations/studentProfileValidation";

export const useStudentProfile = (studentId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  const fetchProfileData = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    setValidationErrors(null);
    try {
      const result = await getStudentProfile(studentId);
      
      let profileObj = null;
      if (result) {
        if (result.studentProfile) {
          profileObj = result.studentProfile;
        } else if (result.data && result.data.studentProfile) {
          profileObj = result.data.studentProfile;
        } else {
          profileObj = result;
        }
      }

      if (profileObj) {
        // Run validation on the resolved profile data
        const validation = validateProfile(profileObj);
        if (!validation.isValid) {
          setValidationErrors(validation.errors);
        }
      }

      setProfile(profileObj);
    } catch (err) {
      setError(err.message || "Failed to load student profile");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const updateProfileLocal = useCallback((updatedFields) => {
    setProfile((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  }, []);

  return {
    profile,
    loading,
    error,
    validationErrors,
    refetch: fetchProfileData,
    updateProfileLocal,
  };
};

export default useStudentProfile;
