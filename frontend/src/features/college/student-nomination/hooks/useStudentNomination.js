import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getEligibleStudents,
  getNominations,
  nominateStudent as nominateStudentService,
  updateNomination as updateNominationService,
  removeNomination as removeNominationService,
} from "../services/studentNominationService";
import {
  validateNomination,
  validateDuplicateNomination,
  validateEditNomination,
} from "../validations/studentNominationValidation";

// ─── Query Keys Definition ───────────────────────────────────────────────────
export const nominationQueryKeys = {
  all: ["nominations"],
  eligible: (driveId, params) => ["nominations", "eligible", driveId || "global", params],
  nominated: (driveId, params) => ["nominations", "nominated", driveId || "global", params],
};

// ─── Normalizer Helpers ──────────────────────────────────────────────────────
const normaliseEligible = (s) => ({
  ...s,
  id: s.id || s.student_id,
  student_id: s.student_id || s.id,
  name: s.name || `${s.first_name || ""} ${s.last_name || ""}`.trim() || "—",
  enrollmentNo: s.enrollment_no || s.enrollmentNo || "—",
  placementStatus: s.placement_status || s.status || "Eligible",
  company: s.company_name || s.company || "—",
  status: s.status || "Eligible",
  alreadyNominated: Boolean(s.already_nominated),
  timeline: {
    nominated: s.nomination_date
      ? new Date(s.nomination_date).toLocaleDateString("en-IN")
      : "—",
  },
});

const normaliseNomination = (n) => ({
  ...n,
  id: n.id,
  student_id: n.student_id || n.studentId,
  name: n.student_name || n.name || `${n.first_name || ""} ${n.last_name || ""}`.trim() || "—",
  enrollmentNo: n.enrollment_no || n.enrollmentNo || "—",
  company: n.company || n.company_name || "—",
  status: n.status || "PENDING",
  timeline: {
    nominated: n.nominated_at
      ? new Date(n.nominated_at).toLocaleDateString("en-IN")
      : n.nomination_date
        ? new Date(n.nomination_date).toLocaleDateString("en-IN")
        : "—",
  },
});

/**
 * Custom React Query Hook for Student Nomination & Shortlisting Workflows
 * 
 * @param {string|number|null} selectedDriveId - ID of active placement drive
 * @param {Object} queryParams - Filters and pagination params ({ page, limit, search })
 */
const useStudentNomination = (selectedDriveId = null, queryParams = {}) => {
  const queryClient = useQueryClient();

  // Helper to invalidate all nomination & eligible query caches
  const invalidateNominationQueries = () => {
    queryClient.invalidateQueries({ queryKey: nominationQueryKeys.all });
  };

  const combinedParams = { ...queryParams, ...(selectedDriveId ? { driveId: selectedDriveId } : {}) };

  // ─── 1. Fetch Eligible Students Query ─────────────────────────────────────
  const eligibleQuery = useQuery({
    queryKey: nominationQueryKeys.eligible(selectedDriveId, queryParams),
    queryFn: async () => {
      const res = await getEligibleStudents(combinedParams);
      return {
        data: (res.data || []).map(normaliseEligible),
        pagination: res.pagination || null,
      };
    },
    placeholderData: keepPreviousData,
  });

  // ─── 2. Fetch Nominated Students Query ────────────────────────────────────
  const nominatedQuery = useQuery({
    queryKey: nominationQueryKeys.nominated(selectedDriveId, queryParams),
    queryFn: async () => {
      const res = await getNominations(combinedParams);
      return {
        data: (res.data || []).map(normaliseNomination),
        pagination: res.pagination || null,
      };
    },
    placeholderData: keepPreviousData,
  });

  // ─── 3. Single / Bulk Nominate Mutation ──────────────────────────────────
  const nominateStudentMutation = useMutation({
    mutationFn: async (studentData) => {
      const payload = {
        studentId: Number(studentData.student_id || studentData.studentId),
        companyId: Number(studentData.company_id || studentData.companyId),
        driveId: Number(selectedDriveId || studentData.driveId || studentData.drive_id),
        minCgpa: studentData.minCgpa ? Number(studentData.minCgpa) : undefined,
        remarks: studentData.remarks || "",
      };
      return await nominateStudentService(payload);
    },
    onSuccess: () => {
      invalidateNominationQueries();
    },
  });

  // ─── 4. Update Nomination Mutation ───────────────────────────────────────
  const updateNominationMutation = useMutation({
    mutationFn: async ({ nominationId, formData }) => {
      return await updateNominationService(nominationId, formData);
    },
    onSuccess: () => {
      invalidateNominationQueries();
    },
  });

  // ─── 5. Remove Nomination Mutation ───────────────────────────────────────
  const removeNominationMutation = useMutation({
    mutationFn: async (nominationId) => {
      return await removeNominationService(nominationId);
    },
    onSuccess: () => {
      invalidateNominationQueries();
    },
  });

  // ─── Consumer Wrapper Methods ──────────────────────────────────────────────

  const nominateStudent = async (studentData) => {
    const validation = validateNomination(studentData);
    if (!validation.isValid) return validation;

    const targetStudentId = studentData.student_id || studentData.studentId;
    const duplicate = validateDuplicateNomination(
      targetStudentId,
      nominatedQuery.data?.data || []
    );
    
    if (duplicate.isDuplicate) {
      return { isValid: false, errors: { student: duplicate.message } };
    }

    try {
      const res = await nominateStudentMutation.mutateAsync(studentData);
      return { isValid: true, data: res.data, message: res.message };
    } catch (err) {
      return {
        isValid: false,
        errors: { service: err.message || "Unable to complete nomination." },
      };
    }
  };

  const updateNomination = async (nominationId, formData, originalData) => {
    const validation = validateEditNomination(formData, originalData);
    if (!validation.isValid) return validation;

    try {
      const res = await updateNominationMutation.mutateAsync({
        nominationId,
        formData,
      });
      return { isValid: true, data: res.data, message: res.message };
    } catch (err) {
      return {
        isValid: false,
        errors: { service: err.message || "Unable to update nomination." },
      };
    }
  };

  const removeNomination = async (nominationId) => {
    try {
      const res = await removeNominationMutation.mutateAsync(nominationId);
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.message || "Unable to remove nomination.",
      };
    }
  };

  // Loading & Error composite state
  const loading =
    eligibleQuery.isLoading ||
    nominatedQuery.isLoading ||
    nominateStudentMutation.isPending ||
    updateNominationMutation.isPending ||
    removeNominationMutation.isPending;

  const error = eligibleQuery.error?.message || nominatedQuery.error?.message || null;

  return {
    // Data lists
    eligibleStudents: eligibleQuery.data?.data || [],
    eligiblePagination: eligibleQuery.data?.pagination || null,
    nominatedStudents: nominatedQuery.data?.data || [],
    nominatedPagination: nominatedQuery.data?.pagination || null,

    // Loading & Error States
    loading,
    isFetching: eligibleQuery.isFetching || nominatedQuery.isFetching,
    error,

    // Action Methods
    nominateStudent,
    updateNomination,
    removeNomination,

    // Query Refetch Trigger
    refreshData: invalidateNominationQueries,
  };
};

export default useStudentNomination;