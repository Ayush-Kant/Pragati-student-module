import { useState } from "react";
import { mockColleges } from "../mockCollegeData";
import { useEffect } from "react";
import { getNeedsRecruitment } from "../services/adminService";
import { getCollegeRankings } from "../services/adminService";

function useCollegeManagement() {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [department, setDepartment] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [needsRecruitment, setNeedsRecruitment] = useState([]);
    const [rankings, setRankings] = useState([]);

    const fetchColleges = async () => {
        try {
            // later replace mock data with API
            // const data = await getColleges();

            // temporary
            return mockColleges;
        }
        catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, status, department]);

    useEffect(() => {
        const fetchNeedsRecruitment = async () => {
            try {
                setLoading(true)
                const data = await getNeedsRecruitment();
                setNeedsRecruitment(data.colleges);
            }
            catch (error) {
                console.error(
                    "Failed to fetch Needs recuitment:",
                    error
                );
            }
            finally {
                setLoading(false);
            }
        };
        fetchNeedsRecruitment();
    }, []);


    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const data = await getCollegeRankings();
                setRankings(data.rankings);
            }
            catch (error) {
                console.error(
                    "Failed to fetch rankings:",
                    error
                );
            }
            finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    const filteredColleges = mockColleges.filter((college) => {
        return (
            (
                college.name.toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
                ||
                college.email.toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
                ||
                college.location.toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
            )
            &&
            (
                status === "all" || college.status === status
            )
            &&
            (
                department === "" || college.departments.some((dept) =>
                    dept.toLowerCase()
                        .includes(department.toLowerCase())
                )
            )
        )
    });


    const itemsPerPage = 5;
    const lastIndex =
        currentPage * itemsPerPage;
    const firstIndex =
        lastIndex - itemsPerPage;
    const currentColleges =
        filteredColleges.slice(
            firstIndex,
            lastIndex
        );
    const totalPages = Math.max(
        1,
        Math.ceil(filteredColleges.length / itemsPerPage)
    );
    return {
        filteredColleges,
        search,
        setSearch,
        status,
        setStatus,
        department,
        setDepartment,
        currentColleges,
        currentPage,
        setCurrentPage,
        totalPages,
        needsRecruitment,
        rankings,
        fetchColleges,
        loading
    };
}

export default useCollegeManagement;