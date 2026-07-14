import { useState, useEffect } from "react";

const mockStudents = [
  {
    id: "stu_001",
    name: "Vedant Bende",
    email: "vedant@college.edu",
    college: { name: "IIT Bombay" },
    gpa: 8.9,
    status: "Verified",
  },
  {
    id: "stu_002",
    name: "Ankit Arora",
    email: "ankit@bits.edu",
    college: { name: "BITS Pilani" },
    gpa: 7.5,
    status: "Pending",
  },
  {
    id: "stu_003",
    name: "Mukesh Chandra",
    email: "mukesh@ranchi.edu",
    college: { name: "Ranchi University" },
    gpa: 6.2,
    status: "Blocked",
  },
];

const useStudentManagement = () => {
    const [students, setStudents] = useState(mockStudents);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // 300ms debounce
    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
        student.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
        student.email
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase());

        const matchesStatus =
        !statusFilter || student.status === statusFilter;

        return matchesSearch && matchesStatus ;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

    const paginatedStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
    );

    return {
        students: paginatedStudents,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        currentPage,
        setCurrentPage,
        filteredStudents,
        totalPages: Math.ceil(
            filteredStudents.length / studentsPerPage
        ),
    };
};

export default useStudentManagement;