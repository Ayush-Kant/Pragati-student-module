import { useEffect, useState } from "react";
import {
  getDrives,
  createDrive,
  freezeDrive as apiFreezeDrive,
  unfreezeDrive as apiUnfreezeDrive
} from "../services/adminService";

export default function useDriveManagement() {
  const [drives, setDrives] = useState([]);

  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("all");
  const [status, setStatus] = useState("all");
  const [stage, setStage] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Live Data Fetching
  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getDrives();
      // The API returns { drives: [...], total: ... }
      if (response && Array.isArray(response.drives)) {
        setDrives(response.drives);
      } else if (Array.isArray(response)) {
        setDrives(response);
      } else {
        setDrives([]);
      }
    } catch (err) {
      console.error("fetchDrives error:", err);
      setError("Unable to fetch drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Filter Drives
  const filteredDrives = drives.filter((drive) => {
    const titleMatch = drive.title || "";
    const matchSearch = titleMatch
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    const companyName = drive.company?.name || "";
    const matchCompany =
      company === "all" || companyName === company;

    const matchStatus =
      status === "all" || drive.status === status;

    const matchStage =
      stage === "all" || drive.currentStage === stage;

    return (
      matchSearch &&
      matchCompany &&
      matchStatus &&
      matchStage
    );
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredDrives.length / itemsPerPage
  );

  const currentDrives = filteredDrives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add Drive
  const addDrive = async (newDriveData) => {
    try {
      setLoading(true);
      setError("");
      // Map form fields to backend payload structure
      const backendPayload = {
        title: newDriveData.title,
        companyId: Number(newDriveData.company),
        criteria: {
          minGpa: parseFloat(newDriveData.minGPA) || 0.0,
          requiredSkills: newDriveData.requiredSkills
            ? newDriveData.requiredSkills.split(",").map(s => s.trim())
            : [],
          maxOpenings: parseInt(newDriveData.maxOpenings, 10) || 1,
        },
        applicationDeadline: newDriveData.deadline || null,
      };

      await createDrive(backendPayload);
      await fetchDrives();
      setShowModal(false);
    } catch (err) {
      console.error("addDrive error:", err);
      setError("Unable to create drive");
    } finally {
      setLoading(false);
    }
  };

  // Delete Drive (local fallback since backend does not support deletion of recruitment drive)
  const deleteDrive = (id) => {
    setDrives((prev) =>
      prev.filter((drive) => drive.id !== id)
    );
  };

  // Freeze Drive
  const freezeDrive = async (id) => {
    try {
      setError("");
      const plainId = String(id).replace("drive_", "");
      await apiFreezeDrive(plainId);
      await fetchDrives();
    } catch (err) {
      console.error("freezeDrive error:", err);
      setError("Unable to freeze drive");
    }
  };

  // Unfreeze Drive
  const unfreezeDrive = async (id) => {
    try {
      setError("");
      const plainId = String(id).replace("drive_", "");
      await apiUnfreezeDrive(plainId);
      await fetchDrives();
    } catch (err) {
      console.error("unfreezeDrive error:", err);
      setError("Unable to unfreeze drive");
    }
  };

  useEffect(() => {
  fetchDrives();
  }, []);

  return {
    search,
    setSearch,

    company,
    setCompany,

    status,
    setStatus,

    stage,
    setStage,

    currentPage,
    setCurrentPage,

    totalPages,

    drives,
    filteredDrives,
    currentDrives,

    showModal,
    setShowModal,

    addDrive,

    loading,
    error,

    deleteDrive,
    freezeDrive,
    unfreezeDrive,

    fetchDrives,
  };
}