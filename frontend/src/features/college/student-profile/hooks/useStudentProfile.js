import { useState, useEffect, useCallback } from "react";
import { getStudentProfile } from "../services/studentProfileService";

export const useStudentProfile = (studentId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getStudentProfile(studentId);
      
      // Safety checks for response structure
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

  const updateProfileLocal = (updatedFields) => {
    setProfile((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfileData,
    updateProfileLocal,
  };
};

export default useStudentProfile;
