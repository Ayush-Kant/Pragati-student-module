import { useState, useEffect, useCallback } from "react";
import { getAcademicPerformance } from "../services/studentProfileService";

export const useAcademicPerformance = (studentId) => {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAcademics = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAcademicPerformance(studentId);
      
      // Safety checks for API response structure
      let academicsArray = [];
      if (Array.isArray(result)) {
        academicsArray = result;
      } else if (result && Array.isArray(result.academicPerformance)) {
        academicsArray = result.academicPerformance;
      } else if (result && result.data && Array.isArray(result.data.academicPerformance)) {
        academicsArray = result.data.academicPerformance;
      }

      setAcademics(academicsArray);
    } catch (err) {
      setError(err.message || "Failed to load academic records");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchAcademics();
  }, [fetchAcademics]);

  const semestersCompleted = academics.length;

  // Compute overall statistics with safety defaults
  const currentCGPA = semestersCompleted > 0 
    ? (academics.reduce((sum, sem) => sum + (parseFloat(sem.sgpa) || 0), 0) / semestersCompleted).toFixed(2)
    : "0.00";

  const averageAttendance = semestersCompleted > 0
    ? Math.round(
        academics.reduce((sum, sem) => {
          const attendanceStr = sem.attendance || "0%";
          const attendanceVal = parseFloat(String(attendanceStr).replace("%", ""));
          return sum + (isNaN(attendanceVal) ? 0 : attendanceVal);
        }, 0) / semestersCompleted
      )
    : 0;

  return {
    academics,
    loading,
    error,
    cgpa: parseFloat(currentCGPA),
    averageAttendance: `${averageAttendance}%`,
    refetch: fetchAcademics,
  };
};

export default useAcademicPerformance;
