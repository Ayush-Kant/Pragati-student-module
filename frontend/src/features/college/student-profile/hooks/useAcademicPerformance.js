import { useState, useEffect, useCallback, useMemo } from "react";
import { getAcademicPerformance } from "../services/studentProfileService";
import { validateAcademicData } from "../validations/studentProfileValidation";

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
      
      let academicsArray = [];
      if (Array.isArray(result)) {
        academicsArray = result;
      } else if (result && Array.isArray(result.academicPerformance)) {
        academicsArray = result.academicPerformance;
      } else if (result && result.data && Array.isArray(result.data.academicPerformance)) {
        academicsArray = result.data.academicPerformance;
      }

      // Validate each academic semester entry
      academicsArray.forEach((sem) => {
        validateAcademicData(sem);
      });

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

  const semestersCompleted = useMemo(() => academics.length, [academics]);

  // Performance Optimization: Memoize CGPA calculation
  const currentCGPA = useMemo(() => {
    return semestersCompleted > 0 
      ? (academics.reduce((sum, sem) => sum + (parseFloat(sem.sgpa) || 0), 0) / semestersCompleted).toFixed(2)
      : "0.00";
  }, [academics, semestersCompleted]);

  // Performance Optimization: Memoize average attendance calculation
  const averageAttendance = useMemo(() => {
    return semestersCompleted > 0
      ? Math.round(
          academics.reduce((sum, sem) => {
            const attendanceStr = sem.attendance || "0%";
            const attendanceVal = parseFloat(String(attendanceStr).replace("%", ""));
            return sum + (isNaN(attendanceVal) ? 0 : attendanceVal);
          }, 0) / semestersCompleted
        )
      : 0;
  }, [academics, semestersCompleted]);

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
