import { useEffect, useState } from "react";
import { getDrives } from "../services/adminService";

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

  // Mock data
  

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Filter Drives
  const filteredDrives = drives.filter((drive) => {
    const matchSearch = drive.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    const matchCompany =
      company === "all" || drive.company.name === company;

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
  const addDrive = (newDrive) => {
    setDrives((prevDrives) => [newDrive, ...prevDrives]);
    setCurrentPage(1);
  };

  // Delete Drive
  const deleteDrive = (id) => {
    setDrives((prev) =>
      prev.filter((drive) => drive.id !== id)
    );
  };

  // Freeze Drive
  const freezeDrive = (id) => {
    setDrives((prev) =>
      prev.map((drive) =>
        drive.id === id
          ? { ...drive, status: "frozen" }
          : drive
      )
    );
  };

  // Unfreeze Drive
  const unfreezeDrive = (id) => {
    setDrives((prev) =>
      prev.map((drive) =>
        drive.id === id
          ? { ...drive, status: "active" }
          : drive
      )
    );
  };

  // Future API
  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDrives();

      setDrives(response.drives || response);

    } catch (err) {
      setError("Unable to fetch drives");
    } finally {
      setLoading(false);
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