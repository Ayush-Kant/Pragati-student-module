import { useEffect, useMemo, useState } from "react";
import { searchStudents } from "../utils/studentNominationHelpers";

/**
 * Custom hook to filter, search, and paginate student nomination lists
 * 
 * @param {Array} students - Array of student/nomination objects
 * @param {number} pageSize - Number of items per page
 */
const useNominationFilters = (students = [], pageSize = 8) => {
  // Functional Filtering State Configurations
  const [searchQuery, setSearchQuery] = useState("");
  const [company, setCompany] = useState("All");
  const [department, setDepartment] = useState("All");
  const [batch, setBatch] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const hasSearched = searchQuery.trim().length > 0;

  const filteredStudents = useMemo(() => {
    const searchedStudents = searchStudents(students, searchQuery);

    return searchedStudents.filter((student) => {
      // 1. Company Filter (Matches Name or ID)
      const matchesCompany =
        company === "All" ||
        student.company === company ||
        student.company_name === company ||
        String(student.company_id || student.companyId || "") === String(company);

      // 2. Department Filter
      const matchesDepartment =
        department === "All" ||
        student.department === department;

      // 3. Batch Filter
      const matchesBatch =
        batch === "All" ||
        String(student.batch) === String(batch);

      // 4. Status Filter (Case-Insensitive)
      const studentStatus = (student.status || student.placementStatus || "").toString().toUpperCase();
      const targetStatus = status.toUpperCase();

      const matchesStatus =
        status === "All" ||
        studentStatus === targetStatus;

      return matchesCompany && matchesDepartment && matchesBatch && matchesStatus;
    });
  }, [students, searchQuery, company, department, batch, status]);

  // Reset to first page when any filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, company, department, batch, status]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  }, [filteredStudents, pageSize]);

  const paginatedStudents = useMemo(() => {
    // Guard against temporary page out-of-bounds state during filter transitions
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, totalPages, pageSize]);

  const resetFilters = () => {
    setSearchQuery("");
    setCompany("All");
    setDepartment("All");
    setBatch("All");
    setStatus("All");
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    hasSearched,
    company,
    setCompany,
    department,
    setDepartment,
    batch,
    setBatch,
    status,
    setStatus,
    resetFilters,
    filteredStudents,
    paginatedStudents,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};

export default useNominationFilters;