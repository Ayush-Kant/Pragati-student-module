import { useState, useCallback } from "react";
import { validateFilters } from "../validations/reportsValidation";

const initialFilterState = {
  search: "",
  type: "All",
  department: "All",
  company: "All",
  batch: "All",
  startDate: "",
  endDate: ""
};

export const useReportFilters = () => {
  const [filters, setFilters] = useState(initialFilterState);
  const [errors, setErrors] = useState({});

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const nextFilters = { ...prev, [key]: value };
      
      // Perform date range validation if dates changed
      if (key === "startDate" || key === "endDate") {
        const validation = validateFilters(nextFilters);
        setErrors((errs) => ({
          ...errs,
          dateRange: validation.errors.dateRange || null
        }));
      }
      
      return nextFilters;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
    setErrors({});
  }, []);

  const filterReports = useCallback((reportsList) => {
    return reportsList.filter((report) => {
      // Search text match
      if (
        filters.search &&
        !report.reportName.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Type match
      if (filters.type !== "All" && report.type !== filters.type) {
        return false;
      }

      // Department match
      if (
        filters.department !== "All" &&
        report.department &&
        report.department !== "All Departments" &&
        report.department !== filters.department
      ) {
        return false;
      }

      // Company match
      if (
        filters.company !== "All" &&
        report.company &&
        report.company !== "All Companies" &&
        report.company !== filters.company
      ) {
        return false;
      }

      // Batch match
      if (filters.batch !== "All" && report.batch && report.batch !== filters.batch) {
        return false;
      }

      // Date range match
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        const generated = new Date(report.generatedOn);
        if (generated < start) return false;
      }
      
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        const generated = new Date(report.generatedOn);
        if (generated > end) return false;
      }

      return true;
    });
  }, [filters]);

  return {
    filters,
    errors,
    setFilter,
    resetFilters,
    filterReports
  };
};
export default useReportFilters;
