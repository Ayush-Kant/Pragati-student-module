import { useEffect, useMemo, useState } from "react";
import { searchStudents } from "../utils/studentNominationHelpers";


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
      const matchesCompany =
  company === "All" ||
  student.company === company ||
  student.company_name === company;

const matchesDepartment =
  department === "All" ||
  student.department === department;

const matchesBatch =
  batch === "All" ||
  student.batch === batch;

const matchesStatus =
  status === "All" ||
  student.status === status ||
  student.placementStatus === status;

      return matchesCompany && matchesDepartment && matchesBatch && matchesStatus;
    });
  }, [students, searchQuery, company, department, batch, status]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, company, department, batch, status]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  }, [filteredStudents, pageSize]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

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
