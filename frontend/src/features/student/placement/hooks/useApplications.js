// src/features/student/placement/hooks/useApplications.js
// TanStack Query hook for job applications with debounced filtering and pagination.

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  QUERY_KEYS,
  STALE_TIME,
  FILTER_DEBOUNCE_MS,
  DEFAULT_PAGE_SIZE,
} from '../constants/placementConstants';
import { getApplications } from '../services/placementService';
import { validateApplicationFilter } from '../validations/placementValidation';

const INITIAL_FILTERS = {
  status: '',
  jobType: '',
  location: '',
  dateRange: '',
  startDate: '',
  endDate: '',
  search: '',
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export function useApplications(initialState = {}) {
  // Active UI filters (updated instantly for responsive UI controls)
  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    ...initialState,
  });

  // Debounced filter state used as TanStack query key
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce search and free-text inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, FILTER_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [filters]);

  // Validate filters before query
  const validation = useMemo(
    () => validateApplicationFilter(debouncedFilters),
    [debouncedFilters]
  );

  const queryKey = useMemo(
    () => [...QUERY_KEYS.APPLICATIONS, debouncedFilters],
    [debouncedFilters]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getApplications(debouncedFilters);
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    enabled: validation.valid,
    staleTime: STALE_TIME.SHORT,
  });

  // Update a single filter field
  const setFilter = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field === 'page' ? value : 1, // reset page to 1 on filter changes unless explicit page change
    }));
  }, []);

  // Update multiple filter fields at once
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  // Reset all filters to initial defaults
  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const setPage = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const setPageSize = useCallback((newPageSize) => {
    setFilters((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

  return {
    applications: data?.applications || [],
    total: data?.total || 0,
    page: data?.page || filters.page,
    pageSize: data?.pageSize || filters.pageSize,
    totalPages: data?.totalPages || 1,
    filters,
    debouncedFilters,
    validationErrors: validation.errors,
    setFilter,
    updateFilters,
    resetFilters,
    setPage,
    setPageSize,
    isLoading,
    isFetching,
    isError,
    error: error?.message || null,
    refetch,
  };
}
