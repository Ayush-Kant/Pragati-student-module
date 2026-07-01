import { useState, useEffect } from "react";

const mockAssessments = [
  {
    id: "assess_401",
    title: "Python Basics Q1",
    type: "MCQ",
    difficulty: "Easy",
    timeLimitMinutes: 30,
    status: "Active",
    questionsCount: 25,
  },
  {
    id: "assess_402",
    title: "MERN Stack Test",
    type: "Coding",
    difficulty: "Hard",
    timeLimitMinutes: 90,
    status: "Active",
    questionsCount: 5,
  },
  {
    id: "assess_403",
    title: "Java Advanced Assessment",
    type: "MCQ",
    difficulty: "Medium",
    timeLimitMinutes: 45,
    status: "Archived",
    questionsCount: 15,
  },
];

const useAssessments = () => {
  /* =========================
     DATA
  ========================= */

  const [assessments, setAssessments] =
    useState(mockAssessments);

  /* =========================
     LOADING
  ========================= */

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* =========================
     TABS
  ========================= */

  const [activeTab, setActiveTab] =
    useState("MCQ Tests");

  /* =========================
     SEARCH
  ========================= */

  const [search, setSearch] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================
     FILTERS
  ========================= */

  const [type, setType] =
    useState("All");

  const [difficulty, setDifficulty] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  /* =========================
     FILTERED DATA
  ========================= */

  const filteredAssessments =
    assessments.filter((assessment) => {
      const matchesSearch =
        assessment.title
          .toLowerCase()
          .includes(
            debouncedSearch.toLowerCase()
          );

      const matchesType =
        type === "All"
          ? true
          : assessment.type === type;

      const matchesDifficulty =
        difficulty === "All"
          ? true
          : assessment.difficulty ===
            difficulty;

      const matchesStatus =
        status === "All"
          ? true
          : assessment.status ===
            status;

      let matchesTab = true;

      if (
        activeTab === "MCQ Tests"
      ) {
        matchesTab =
          assessment.type === "MCQ";
      }

      if (
        activeTab ===
        "Coding Tests"
      ) {
        matchesTab =
          assessment.type ===
          "Coding";
      }

      if (
        activeTab === "Archives"
      ) {
        matchesTab =
          assessment.status ===
          "Archived";
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesDifficulty &&
        matchesStatus &&
        matchesTab
      );
    });

  return {
    /* Loading */
    loading,

    /* Data */
    assessments,
    setAssessments,
    filteredAssessments,

    /* Tabs */
    activeTab,
    setActiveTab,

    /* Search */
    search,
    setSearch,
    debouncedSearch,

    /* Filters */
    type,
    setType,

    difficulty,
    setDifficulty,

    status,
    setStatus,
  };
};

export default useAssessments;