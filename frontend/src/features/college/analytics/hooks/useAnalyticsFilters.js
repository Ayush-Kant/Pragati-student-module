import { useState, useCallback } from 'react';

export const useAnalyticsFilters = () => {
  const [filters, setFilters] = useState({
    batch: '2026',
    department: 'All',
    company: 'All',
    reportType: 'Overview',
    dateRange: { start: '', end: '' }
  });
  const [filterError, setFilterError] = useState(null);

  const setBatch = useCallback((batch) => {
    setFilters((prev) => ({ ...prev, batch }));
  }, []);

  const setDepartment = useCallback((department) => {
    setFilters((prev) => ({ ...prev, department }));
  }, []);

  const setCompany = useCallback((company) => {
    setFilters((prev) => ({ ...prev, company }));
  }, []);

  const setReportType = useCallback((reportType) => {
    setFilters((prev) => ({ ...prev, reportType }));
  }, []);

  const setDateRange = useCallback((dateRange) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  }, []);

  const updateFilterField = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      batch: '2026',
      department: 'All',
      company: 'All',
      reportType: 'Overview',
      dateRange: { start: '', end: '' }
    });
    setFilterError(null);
  }, []);

  return {
    filters,
    filterError,
    updateFilterField,
    setBatch,
    setDepartment,
    setCompany,
    setReportType,
    setDateRange,
    resetFilters
  };
};