import { useEffect, useState, useCallback } from "react";
import {
  getEligibleStudents,
  getNominations,
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
  const [eligibleStudentsList, setEligibleStudents] = useState([]);
  const [nominatedStudentsList, setNominatedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNominationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [eligibleResponse, nominatedResponse] = await Promise.all([
        getEligibleStudents(),
        getNominations(),
      ]);

      if (eligibleResponse.success) {
        setEligibleStudents(
          (eligibleResponse.data || []).map((s) => ({
            ...s,
            id: s.id,
            enrollmentNo: s.enrollment_no || s.enrollmentNo,
            placementStatus: s.placement_status || s.placementStatus,
            company: s.company_name || s.company || "—",
            status: s.placement_status || "Eligible",
            timeline: {
              nominated: s.nomination_date
                ? new Date(s.nomination_date).toLocaleDateString("en-IN")
                : "—",
            },
          }))
        );
      }

      if (nominatedResponse.success) {
        setNominatedStudents(
          (nominatedResponse.data || []).map((n) => ({
            ...n,
            name: n.student_name || n.name,
            enrollmentNo: n.enrollment_no || n.enrollmentNo,
            company: n.company_name || n.company,
            status: n.status || 'Pending',
            timeline: {
              nominated: n.nomination_date
                ? new Date(n.nomination_date).toLocaleDateString("en-IN")
                : "—",
            },
          }))
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load nomination data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNominationData();
  }, [fetchNominationData]);

  const nominateStudent = async (studentData) => {
    console.log("HOOK START", studentData);

    const validation = validateNomination(studentData);
    console.log("VALIDATION", validation);

    if (!validation.isValid) {
      console.log("VALIDATION FAILED", validation.errors);
      return validation;
    }

    const duplicate = validateDuplicateNomination(
      studentData.student_id,
      nominatedStudentsList
    );

    if (duplicate.isDuplicate) {
      return {
        isValid: false,
        errors: { student: duplicate.message },
      };
    }

    try {
      setLoading(true);

      const apiPayload = {
        student_id: studentData.student_id,
        company_id: studentData.company_id,
        company_name: studentData.company_name,
        remarks: studentData.remarks || '',
      }

      console.log("CALLING SERVICE WITH", apiPayload);
      const response = await nominateStudentService(apiPayload);
      console.log("SERVICE RESPONSE", response);

      if (response.success) {
        // setNominatedStudents((prev) => [...prev, response.data]);
      }

      return {
        isValid: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (err) {
      console.log("SERVICE ERROR:", err);
      return {
        isValid: false,
        errors: {
          service: err.message || "Unable to complete nomination.",
        },
      };
    } finally {
      setLoading(false);
    }
  };

  const updateNomination = async (studentId, formData, originalData) => {
    const validation = validateEditNomination(formData, originalData);
    if (!validation.isValid) return validation;

    try {
      setLoading(true);
      const response = await updateNominationService(studentId, formData);
      if (response.success) {
        setNominatedStudents((prev) =>
          prev.map((student) =>
            student.id === studentId ? response.data : student
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
          service: err.message || "Unable to update nomination.",
        },
      };
    } finally {
      setLoading(false);
    }
  };

  const removeNomination = async (studentId) => {
    try {
      setLoading(true);
      const response = await removeNominationService(studentId);
      if (response.success) {
        setNominatedStudents((prev) =>
          prev.filter((student) => student.id !== studentId)
        );
      }
      return response;
    } catch (err) {
      return {
        success: false,
        message: err.message || "Unable to remove nomination.",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    eligibleStudents: eligibleStudentsList,
    nominatedStudents: nominatedStudentsList,
    loading,
    error,
    nominateStudent,
    updateNomination,
    removeNomination,
    refreshData: fetchNominationData,
  };
};

export default useStudentNomination;