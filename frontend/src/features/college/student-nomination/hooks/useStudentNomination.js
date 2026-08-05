import { useEffect, useState, useCallback } from "react";
import {
  getEligibleForDrive,
  getDriveNominations,
  nominateStudentsToDrive,
  shortlistStudentsForDrive,
  setStudentEligibility,
  // legacy (non-drive)
  getEligibleStudents,
  getNominations,
  nominateStudent as nominateStudentLegacy,
  updateNomination as updateNominationLegacy,
  removeNomination as removeNominationLegacy,
} from "../services/studentNominationService";
import {
  validateNomination,
  validateDuplicateNomination,
  validateEditNomination,
} from "../validations/studentNominationValidation";

// ─── Normalise a raw eligible_student row ────────────────────────────────────
const normaliseEligible = (s) => ({
  ...s,
  id: s.id,
  enrollmentNo: s.enrollment_no || s.enrollmentNo,
  placementStatus: s.placement_status || s.placementStatus,
  company: s.company_name || s.company || "—",
  status: s.placement_status || "Eligible",
  alreadyNominated: s.already_nominated || false,
  timeline: {
    nominated: s.nomination_date
      ? new Date(s.nomination_date).toLocaleDateString("en-IN")
      : "—",
  },
});

// ─── Normalise a raw nomination row ──────────────────────────────────────────
const normaliseNomination = (n) => ({
  ...n,
  name: n.student_name || n.name,
  enrollmentNo: n.enrollment_no || n.enrollmentNo,
  company: n.company || n.company_name || "—",
  status: n.status || "Nominated",
  timeline: {
    nominated: n.nominated_at
      ? new Date(n.nominated_at).toLocaleDateString("en-IN")
      : n.nomination_date
        ? new Date(n.nomination_date).toLocaleDateString("en-IN")
        : "—",
  },
});

const useStudentNomination = (selectedDriveId = null) => {
  const [eligibleStudentsList, setEligibleStudents] = useState([]);
  const [nominatedStudentsList, setNominatedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Fetch data ──────────────────────────────────────────────────────────
  const fetchNominationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (selectedDriveId) {
        // Drive-scoped fetch
        const [eligibleRes, nominatedRes] = await Promise.all([
          getEligibleForDrive(selectedDriveId),
          getDriveNominations(selectedDriveId),
        ]);

        if (eligibleRes.success) {
          setEligibleStudents((eligibleRes.data || []).map(normaliseEligible));
        } else {
          setError(eligibleRes.message || "Failed to load eligible students.");
        }

        if (nominatedRes.success) {
          setNominatedStudents((nominatedRes.data || []).map(normaliseNomination));
        }
      } else {
        // Legacy global fetch (no drive selected)
        const [eligibleResponse, nominatedResponse] = await Promise.all([
          getEligibleStudents(),
          getNominations(),
        ]);

        if (eligibleResponse.success) {
          setEligibleStudents((eligibleResponse.data || []).map(normaliseEligible));
        }
        if (nominatedResponse.success) {
          setNominatedStudents((nominatedResponse.data || []).map(normaliseNomination));
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load nomination data.");
    } finally {
      setLoading(false);
    }
  }, [selectedDriveId]);

  useEffect(() => {
    fetchNominationData();
  }, [fetchNominationData]);

  // ─── Bulk nominate selected students to a drive ──────────────────────────
  const bulkNominate = useCallback(
    async (studentIds) => {
      if (!selectedDriveId) {
        return { success: false, message: "No drive selected." };
      }
      try {
        setLoading(true);
        const response = await nominateStudentsToDrive(selectedDriveId, studentIds);
        if (response.success) {
          await fetchNominationData();
        }
        return response;
      } catch (err) {
        return { success: false, message: err.message || "Bulk nomination failed." };
      } finally {
        setLoading(false);
      }
    },
    [selectedDriveId, fetchNominationData]
  );

  // ─── Bulk shortlist nominated students ───────────────────────────────────
  const bulkShortlist = useCallback(
    async (studentIds) => {
      if (!selectedDriveId) {
        return { success: false, message: "No drive selected." };
      }
      try {
        setLoading(true);
        const response = await shortlistStudentsForDrive(selectedDriveId, studentIds);
        if (response.success) {
          await fetchNominationData();
        }
        return response;
      } catch (err) {
        return { success: false, message: err.message || "Bulk shortlist failed." };
      } finally {
        setLoading(false);
      }
    },
    [selectedDriveId, fetchNominationData]
  );

  // ─── Approve / reject a student's eligibility for the drive ─────────────
  const approveEligibility = useCallback(
    async (studentId, approved) => {
      if (!selectedDriveId) {
        return { success: false, message: "No drive selected." };
      }
      try {
        setLoading(true);
        const response = await setStudentEligibility(selectedDriveId, studentId, approved);
        if (response.success) {
          await fetchNominationData();
        }
        return response;
      } catch (err) {
        return { success: false, message: err.message || "Failed to update eligibility." };
      } finally {
        setLoading(false);
      }
    },
    [selectedDriveId, fetchNominationData]
  );

  // ─── Legacy single-student nominate (used by the form) ───────────────────
  const nominateStudent = async (studentData) => {
    const validation = validateNomination(studentData);
    if (!validation.isValid) return validation;

    const duplicate = validateDuplicateNomination(
      studentData.student_id,
      nominatedStudentsList
    );
    if (duplicate.isDuplicate) {
      return { isValid: false, errors: { student: duplicate.message } };
    }

    // If a drive is selected, use bulk-nominate with a single student
    if (selectedDriveId) {
      try {
        setLoading(true);
        const response = await nominateStudentsToDrive(selectedDriveId, [
          studentData.student_id,
        ]);
        if (response.success) {
          await fetchNominationData();
        }
        return { isValid: response.success, message: response.message };
      } catch (err) {
        return { isValid: false, errors: { service: err.message } };
      } finally {
        setLoading(false);
      }
    }

    // Legacy path (no drive)
    try {
      setLoading(true);
      const apiPayload = {
        student_id: studentData.student_id,
        company_id: studentData.company_id,
        company_name: studentData.company_name,
        role: studentData.role || "",
        package: studentData.package || 0,
        remarks: studentData.remarks || "",
      };
      const response = await nominateStudentLegacy(apiPayload);
      return { isValid: response.success, data: response.data, message: response.message };
    } catch (err) {
      return { isValid: false, errors: { service: err.message || "Unable to complete nomination." } };
    } finally {
      setLoading(false);
    }
  };

  // ─── Legacy: update nomination ────────────────────────────────────────────
  const updateNomination = async (studentId, formData, originalData) => {
    const validation = validateEditNomination(formData, originalData);
    if (!validation.isValid) return validation;
    try {
      setLoading(true);
      const response = await updateNominationLegacy(studentId, formData);
      if (response.success) {
        setNominatedStudents((prev) =>
          prev.map((s) => (s.id === studentId ? response.data : s))
        );
      }
      return { isValid: response.success, data: response.data, message: response.message };
    } catch (err) {
      return { isValid: false, errors: { service: err.message || "Unable to update nomination." } };
    } finally {
      setLoading(false);
    }
  };

  // ─── Legacy: remove nomination ────────────────────────────────────────────
  const removeNomination = async (studentId) => {
    try {
      setLoading(true);
      const response = await removeNominationLegacy(studentId);
      if (response.success) {
        setNominatedStudents((prev) => prev.filter((s) => s.id !== studentId));
      }
      return response;
    } catch (err) {
      return { success: false, message: err.message || "Unable to remove nomination." };
    } finally {
      setLoading(false);
    }
  };

  return {
    eligibleStudents: eligibleStudentsList,
    nominatedStudents: nominatedStudentsList,
    loading,
    error,
    // drive-scoped
    bulkNominate,
    bulkShortlist,
    approveEligibility,
    // legacy / single-student
    nominateStudent,
    updateNomination,
    removeNomination,
    refreshData: fetchNominationData,
  };
};

export default useStudentNomination;
