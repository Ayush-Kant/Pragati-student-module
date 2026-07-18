import { useCallback, useEffect, useState } from "react";

import {
  getShortlistedStudents,
} from "../services/studentNominationService";

import {
  validateShortlist,
} from "../validations/studentNominationValidation";

const useShortlistedStudents = () => {
  const [shortlistedStudents, setShortlistedStudents] =
    useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  /* =====================================
          Fetch Shortlisted Students
  ===================================== */

  const fetchShortlistedStudents =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getShortlistedStudents();

        if (response.success) {
          setShortlistedStudents(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(
          err.message ||
            "Failed to fetch shortlisted students."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchShortlistedStudents();
  }, [fetchShortlistedStudents]);

  /* =====================================
          Mark Student Selected
  ===================================== */

  const markStudentSelected = async (
    studentId
  ) => {
    const student = shortlistedStudents.find(
      (student) => student.id === studentId
    );

    const validation =
      validateShortlist(student);

    if (!validation.isValid) {
      return validation;
    }

    setShortlistedStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status: "Selected",
              selected: true,
              selectedDate: new Date().toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              ),
            }
          : student
      )
    );

    return {
      isValid: true,
      message:
        "Student marked as selected successfully.",
    };
  };

  /* =====================================
          Refresh
  ===================================== */

  const refreshData = () => {
    fetchShortlistedStudents();
  };

  return {
    shortlistedStudents,

    loading,
    error,

    markStudentSelected,

    refreshData,
  };
};

export default useShortlistedStudents;