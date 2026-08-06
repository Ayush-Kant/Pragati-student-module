import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getShortlistedStudents,
  updateShortlistStatus,
  removeShortlistEntry,
} from "../services/studentNominationService";
import { validateShortlist } from "../validations/studentNominationValidation";
import { nominationQueryKeys } from "./useStudentNomination";

// ─── Shortlist Query Keys ───────────────────────────────────────────────────
export const shortlistQueryKeys = {
  all: ["shortlistedStudents"],
  list: (params) => ["shortlistedStudents", params],
};

// ─── Normalizer Helper ──────────────────────────────────────────────────────
const normaliseShortlisted = (s) => ({
  ...s,
  id: s.id,
  student_id: s.student_id || s.studentId,
  name: s.name || `${s.first_name || ""} ${s.last_name || ""}`.trim() || "—",
  enrollmentNo: s.enrollment_no || s.enrollmentNo || "—",
  company: s.company_name || s.company || "—",
  status: (s.status || (s.selected ? "SELECTED" : "SHORTLISTED")).toUpperCase(),
  timeline: {
    shortlisted: s.shortlisted_date
      ? new Date(s.shortlisted_date).toLocaleDateString("en-IN")
      : "—",
    selected: s.selected_date
      ? new Date(s.selected_date).toLocaleDateString("en-IN")
      : s.selectedDate || "—",
  },
});

/**
 * React Query Custom Hook for Shortlisted Students Management
 * 
 * @param {Object} queryParams - Query parameters ({ page, limit, companyId, status, search })
 */
const useShortlistedStudents = (queryParams = {}) => {
  const queryClient = useQueryClient();

  // Helper to invalidate shortlist and nomination queries across the app
  const invalidateShortlistQueries = () => {
    queryClient.invalidateQueries({ queryKey: shortlistQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: nominationQueryKeys.all });
  };

  // ─── 1. Fetch Shortlisted Students Query ──────────────────────────────────
  const shortlistQuery = useQuery({
    queryKey: shortlistQueryKeys.list(queryParams),
    queryFn: async () => {
      const res = await getShortlistedStudents(queryParams);
      return {
        data: (res.data || []).map(normaliseShortlisted),
        pagination: res.pagination || null,
      };
    },
    placeholderData: keepPreviousData,
  });

  // ─── 2. Mark Selected Mutation ─────────────────────────────────────────
  const markSelectedMutation = useMutation({
    mutationFn: async ({ shortlistId, payload }) => {
      return await updateShortlistStatus(shortlistId, payload);
    },
    onSuccess: () => {
      invalidateShortlistQueries();
    },
  });

  // ─── 3. Remove Shortlist Mutation ──────────────────────────────────────
  const removeShortlistMutation = useMutation({
    mutationFn: async (shortlistId) => {
      return await removeShortlistEntry(shortlistId);
    },
    onSuccess: () => {
      invalidateShortlistQueries();
    },
  });

  // ─── Consumer Methods ──────────────────────────────────────────────────

  /**
   * Persists "Mark Selected" action to backend DB
   * @param {string|number} studentId - Shortlist record ID
   */
  const markStudentSelected = async (studentId) => {
    const studentList = shortlistQuery.data?.data || [];
    const student = studentList.find((s) => s.id === studentId);

    const validation = validateShortlist(student);
    if (!validation.isValid) return validation;

    try {
      const res = await markSelectedMutation.mutateAsync({
        shortlistId: studentId,
        payload: {
          status: "SELECTED",
          selected: true,
          selected_date: new Date().toISOString(),
        },
      });

      return {
        isValid: true,
        data: res.data,
        message: res.message || "Student marked as selected successfully.",
      };
    } catch (err) {
      return {
        isValid: false,
        errors: {
          service: err.message || "Failed to update selection status on backend.",
        },
      };
    }
  };

  /**
   * Persists shortlist removal action to backend DB
   * @param {string|number} shortlistId - Shortlist record ID
   */
  const removeShortlist = async (shortlistId) => {
    try {
      const res = await removeShortlistMutation.mutateAsync(shortlistId);
      return {
        success: true,
        message: res.message || "Student removed from shortlist.",
      };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Failed to remove student from shortlist.",
      };
    }
  };

  // Composite loading & error states
  const loading =
    shortlistQuery.isLoading ||
    markSelectedMutation.isPending ||
    removeShortlistMutation.isPending;

  const error = shortlistQuery.error?.message || null;

  return {
    // Data list & Pagination Metadata
    shortlistedStudents: shortlistQuery.data?.data || [],
    pagination: shortlistQuery.data?.pagination || null,

    // Status Flags
    loading,
    isFetching: shortlistQuery.isFetching,
    error,

    // Action Methods
    markStudentSelected,
    removeShortlist,

    // Manual Cache Invalidation Callback
    refreshData: invalidateShortlistQueries,
  };
};

export default useShortlistedStudents;