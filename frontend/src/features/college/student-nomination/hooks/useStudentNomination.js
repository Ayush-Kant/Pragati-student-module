import { useEffect, useState, useCallback } from "react";

import {
  getEligibleStudents,
  getNominatedStudents,
  nominateStudent as nominateStudentService,
  updateNomination as updateNominationService,
  removeNomination as removeNominationService,
} from "../services/studentNominationService";

import {
  validateNomination,
  validateEditNomination,
  validateDuplicateNomination,
} from "../validations/studentNominationValidation";

const useStudentNomination = () => {
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [nominatedStudents, setNominatedStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =====================================
          Fetch Data
  ===================================== */

  const fetchNominationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [eligibleResponse, nominatedResponse] =
        await Promise.all([
          getEligibleStudents(),
          getNominatedStudents(),
        ]);

      if (eligibleResponse.success) {
        setEligibleStudents(eligibleResponse.data);
      }

      if (nominatedResponse.success) {
        setNominatedStudents(nominatedResponse.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNominationData();
  }, [fetchNominationData]);

  /* =====================================
          Nominate Student
  ===================================== */

  const nominateStudent = async (studentData) => {
    const validation = validateNomination(studentData);

    if (!validation.isValid) {
      return validation;
    }

    const duplicate = validateDuplicateNomination(
      studentData.id,
      nominatedStudents
    );

    if (duplicate.isDuplicate) {
      return {
        isValid: false,
        errors: {
          student: duplicate.message,
        },
      };
    }

    try {
      setLoading(true);

      const response =
        await nominateStudentService(studentData);

      if (response.success) {
        setNominatedStudents((prev) => [
          ...prev,
          response.data,
        ]);
      }

      return {
        isValid: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (err) {
      return {
        isValid: false,
        errors: {
          service:
            err.message ||
            "Unable to nominate student.",
        },
      };
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
          Update Nomination
  ===================================== */

  const updateNomination = async (
    studentId,
    formData,
    originalData
  ) => {
    const validation =
      validateEditNomination(
        formData,
        originalData
      );

    if (!validation.isValid) {
      return validation;
    }

    try {
      setLoading(true);

      const response =
        await updateNominationService(
          studentId,
          formData
        );

      if (response.success) {
        setNominatedStudents((prev) =>
          prev.map((student) =>
            student.id === studentId
              ? response.data
              : student
          )
        );
      }

      return {
        isValid: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (err) {
      return {
        isValid: false,
        errors: {
          service:
            err.message ||
            "Unable to update nomination.",
        },
      };
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
          Remove Nomination
  ===================================== */

  const removeNomination = async (studentId) => {
    try {
      setLoading(true);

      const response =
        await removeNominationService(
          studentId
        );

      if (response.success) {
        setNominatedStudents((prev) =>
          prev.filter(
            (student) =>
              student.id !== studentId
          )
        );
      }

      return response;
    } catch (err) {
      return {
        success: false,
        message:
          err.message ||
          "Unable to remove nomination.",
      };
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
          Refresh
  ===================================== */

  const refreshData = () => {
    fetchNominationData();
  };

  return {
    eligibleStudents,
    nominatedStudents,

    loading,
    error,

    nominateStudent,
    updateNomination,
    removeNomination,

    refreshData,
  };
};

export default useStudentNomination;