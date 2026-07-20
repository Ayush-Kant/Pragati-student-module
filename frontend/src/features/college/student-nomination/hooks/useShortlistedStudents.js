import { useCallback, useEffect, useState } from "react";
import { getShortlistedStudents } from "../services/studentNominationService";
import { validateShortlist } from "../validations/studentNominationValidation";

const useShortlistedStudents = () => {
  const [shortlistedStudentsList, setShortlistedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShortlistedStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getShortlistedStudents();
      if (response.success) {
        setShortlistedStudents(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch active corporate shortlists.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShortlistedStudents();
  }, [fetchShortlistedStudents]);

  const markStudentSelected = async (studentId) => {
    const student = shortlistedStudentsList.find((s) => s.id === studentId);
    
    const validation = validateShortlist(student);
    if (!validation.isValid) return validation;

    setShortlistedStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: "Selected",
              selected: true,
              selectedDate: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }
          : s
      )
    );

    return {
      isValid: true,
      message: "Student marked as selected successfully.",
    };
  };

  return {
    shortlistedStudents: shortlistedStudentsList,
    loading,
    error,
    markStudentSelected,
    refreshData: fetchShortlistedStudents,
  };
};

export default useShortlistedStudents;