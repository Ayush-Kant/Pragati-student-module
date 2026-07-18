import { useEffect, useMemo, useState } from "react";
import { searchStudents } from "../utils/studentNominationHelpers";

const useNominationFilters = (
    students = [],
    pageSize = 8
) => {
    /* =====================================
              Search
    ===================================== */

    const [searchQuery, setSearchQuery] = useState("");

    /* =====================================
              Filters
    ===================================== */

    const [company, setCompany] = useState("All");

    const [department, setDepartment] =
        useState("All");

    const [batch, setBatch] = useState("All");

    const [status, setStatus] = useState("All");

    /* =====================================
              Pagination
    ===================================== */

    const [currentPage, setCurrentPage] =
        useState(1);

    /* =====================================
              Search State
    ===================================== */

    const hasSearched =
        searchQuery.trim().length > 0;

    /* =====================================
          Filter Students
===================================== */

    const filteredStudents = useMemo(() => {
        const searchedStudents = searchStudents(
            students,
            searchQuery
        );

        return searchedStudents.filter((student) => {
            const matchesCompany =
                company === "All" ||
                student.company === company;

            const matchesDepartment =
                department === "All" ||
                student.department === department;

            const matchesBatch =
                batch === "All" ||
                student.batch === batch;

            const matchesStatus =
                status === "All" ||
                student.status === status;

            return (
                matchesCompany &&
                matchesDepartment &&
                matchesBatch &&
                matchesStatus
            );
        });
    }, [
        students,
        searchQuery,
        company,
        department,
        batch,
        status,
    ]);

    /* =====================================
              Reset Page
    ===================================== */

    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchQuery,
        company,
        department,
        batch,
        status,
    ]);

    /* =====================================
              Pagination
    ===================================== */

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredStudents.length / pageSize
        )
    );

    const paginatedStudents = useMemo(() => {
        const start =
            (currentPage - 1) * pageSize;

        return filteredStudents.slice(
            start,
            start + pageSize
        );
    }, [
        filteredStudents,
        currentPage,
        pageSize,
    ]);

    /* =====================================
              Reset Filters
    ===================================== */

    const resetFilters = () => {
        setSearchQuery("");
        setCompany("All");
        setDepartment("All");
        setBatch("All");
        setStatus("All");
        setCurrentPage(1);
    };

    return {
        /* Search */

        searchQuery,
        setSearchQuery,

        hasSearched,

        /* Filters */

        company,
        setCompany,

        department,
        setDepartment,

        batch,
        setBatch,

        status,
        setStatus,

        resetFilters,

        /* Results */

        filteredStudents,

        paginatedStudents,

        /* Pagination */

        currentPage,
        setCurrentPage,

        totalPages,
    };
};

export default useNominationFilters;