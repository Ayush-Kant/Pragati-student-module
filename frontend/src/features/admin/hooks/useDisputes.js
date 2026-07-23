import { useState, useEffect, useCallback } from "react";
import { getDisputes } from "../services/adminService";

const useDisputes = () => {
  const [disputes, setDisputes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [limit] = useState(20);

  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    type: "",
    search: "",
  });

    const mockDisputes = [
    {
        id: "disp_001",
        filedBy: { name: "Rahul Sharma" },
        against: { name: "ABC College" },
        type: "Mentor Issue",
        status: "open",
        priority: "high",
        createdAt: "2026-06-20T10:30:00Z",
    },
    {
        id: "disp_002",
        filedBy: { name: "Priya Reddy" },
        against: { name: "XYZ Company" },
        type: "Payment",
        status: "resolved",
        priority: "medium",
        createdAt: "2026-06-18T14:20:00Z",
    },
    ];

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
        };

        if (filters.search) {
        params.search = filters.search;
        }

        if (filters.status) {
        params.status = filters.status;
        }

        if (filters.priority) {
        params.priority = filters.priority;
        }

        if (filters.type) {
        params.type = filters.type;
        }

    //const data = await getDisputes(params);

      let filteredDisputes = [...mockDisputes];

        // Search
        if (filters.search) {
        filteredDisputes = filteredDisputes.filter(
            (dispute) =>
            dispute.id.toLowerCase().includes(filters.search.toLowerCase()) ||
            dispute.filedBy.name
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
            dispute.against.name
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
            dispute.type
                .toLowerCase()
                .includes(filters.search.toLowerCase())
        );
        }

        // Status
        if (filters.status) {
        filteredDisputes = filteredDisputes.filter(
            (dispute) =>
            dispute.status.toLowerCase() === filters.status.toLowerCase()
        );
        }

        // Priority
        if (filters.priority) {
        filteredDisputes = filteredDisputes.filter(
            (dispute) =>
            dispute.priority.toLowerCase() ===
            filters.priority.toLowerCase()
        );
        }

        // Type
        if (filters.type) {
        filteredDisputes = filteredDisputes.filter(
            (dispute) =>
            dispute.type.toLowerCase() ===
            filters.type.toLowerCase()
        );
        }

        setDisputes(filteredDisputes);
        setTotal(filteredDisputes.length);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load disputes."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

 

  useEffect(() => {
  setPage(1);
}, [filters.search, filters.status, filters.priority, filters.type]);

  return {
    disputes,

    loading,

    error,

    page,

    limit,

    total,

    filters,

    setFilters,

    setPage,

    refreshDisputes: fetchDisputes,
  };
};

export default useDisputes;