import { useState, useEffect, useCallback, useMemo } from "react";
import { menteeManagementService } from "../services/menteeManagementService";

export default function useMentees() {
  const [mentees, setMentees] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    course: "All",
    batch: "All",
    status: "All",
  });
  const [sortBy, setSortBy] = useState("name"); // 'name', 'progress', 'attendance', 'lastActive'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchMentees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menteeManagementService.getMentees();
      setMentees(data.students || []);
      setStats(data.stats || { total: 0, active: 0, completed: 0, urgent: 0 });
    } catch (err) {
      console.error("Error fetching mentees in hook:", err);
      setError(err.message || "Failed to load mentees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentees();
  }, [fetchMentees]);

  // Derived filtered & sorted list
  const filteredMentees = useMemo(() => {
    let result = [...mentees];

    // Search filter (name or email)
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query)
      );
    }

    // Dropdown filters
    if (filters.course !== "All") {
      result = result.filter((m) => m.course === filters.course);
    }
    if (filters.batch !== "All") {
      result = result.filter((m) => m.batch === filters.batch);
    }
    if (filters.status !== "All") {
      result = result.filter((m) => m.status.toUpperCase() === filters.status.toUpperCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "progress") {
        // Convert to number
        const progressA = Number(a.progress) || 0;
        const progressB = Number(b.progress) || 0;
        return progressB - progressA; // High progress first
      }
      if (sortBy === "attendance") {
        const attA = parseInt(a.attendance) || 0;
        const attB = parseInt(b.attendance) || 0;
        return attB - attA;
      }
      if (sortBy === "lastActive") {
        return a.lastActive.localeCompare(b.lastActive);
      }
      return 0;
    });

    return result;
  }, [mentees, searchTerm, filters, sortBy]);

  // Pagination calculations
  const totalEntries = filteredMentees.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  const paginatedMentees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMentees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMentees, currentPage, itemsPerPage]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Get list of unique courses and batches for dynamic filters
  const filterOptions = useMemo(() => {
    const coursesSet = new Set();
    const batchesSet = new Set();
    mentees.forEach((m) => {
      if (m.course) coursesSet.add(m.course);
      if (m.batch) batchesSet.add(m.batch);
    });
    return {
      courses: Array.from(coursesSet),
      batches: Array.from(batchesSet),
    };
  }, [mentees]);

  return {
    mentees: paginatedMentees,
    rawMentees: mentees,
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    totalEntries,
    itemsPerPage,
    filterOptions,
    refetch: fetchMentees,
  };
}
