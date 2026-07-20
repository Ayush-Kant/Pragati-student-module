// AssignmentsPage.jsx
// Purpose: Tabbed list of all student assignments organised by status: pending, submitted, and graded (SM-06)

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAssignments from "../../assignments/hooks/useAssignments";
import useAssignmentFilters from "../../assignments/hooks/useAssignmentFilters";
import useDarkMode from "../../assignments/hooks/useDarkMode";
import CompletionStatistics from "../../assignments/components/progress/CompletionStatistics";
import DeadlineTracker from "../../assignments/components/progress/DeadlineTracker";
import AssignmentTable from "../../assignments/components/assignments/AssignmentTable";
import AssignmentCard from "../../assignments/components/assignments/AssignmentCard";
import SearchAssignment from "../../assignments/components/filters/SearchAssignment";
import StatusFilter from "../../assignments/components/filters/StatusFilter";
import SubjectFilter from "../../assignments/components/filters/SubjectFilter";
import ErrorState from "../../assignments/components/common/ErrorState";
import { SkeletonAssignmentPage } from "../../assignments/components/common/LoadingSpinner";
import {
  ClipboardList,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Moon,
  Sun,
} from "lucide-react";

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const { assignments, loading, error } = useAssignments();
  const {
    searchTerm,
    status,
    subject,
    filteredAssignments,
    setSearchTerm,
    setStatus,
    setSubject,
  } = useAssignmentFilters(assignments);

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [viewMode, setViewMode] = useState("grid");

  const subjects = useMemo(
    () => [...new Set(assignments.map((a) => a.subject))],
    [assignments]
  );

  const handleSelectAssignment = (assignment) => {
    navigate(`/student/assignments/${assignment.id}`);
  };

  const isFiltered = searchTerm || status !== "All" || subject !== "All";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-[#f8f9fb]"}`}>

      {/* ─────────────────────────────────────────────────────────────
          Hero header — premium, white, sticky
      ───────────────────────────────────────────────────────────── */}
      <div className={`border-b sticky top-0 z-10 transition-colors duration-300 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 py-5">

            {/* Left: icon + text */}
            <div className="flex items-center gap-4">
              {/* Theme-aware icon container — follows module pattern */}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
                darkMode
                  ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-400/30"
                  : "bg-blue-50 shadow-blue-100/60"
              }`}>
                <ClipboardList
                  className={`w-5 h-5 ${darkMode ? "text-white" : "text-blue-600"}`}
                  strokeWidth={2}
                />
              </div>

              <div>
                <h1 className={`text-xl font-bold tracking-tight leading-none transition-colors ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Assignments
                </h1>
                <p className={`text-sm mt-1 leading-none transition-colors ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                  Track, submit and review your course assignments
                </p>
              </div>
            </div>

            {/* Right: count badge + dark mode toggle */}
            <div className="flex items-center gap-3 shrink-0">
              {!loading && !error && (
                <span className={`hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${darkMode ? "text-slate-300 bg-slate-800 border-slate-600" : "text-gray-700 bg-gray-100 border-gray-200/80"}`}>
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  {assignments.length} assignments
                </span>
              )}
              {/* Dark mode toggle button */}
              <button
                onClick={toggleDarkMode}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 shadow-sm ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Page body
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

        {loading && <SkeletonAssignmentPage darkMode={darkMode} />}
        {!loading && error && <ErrorState message={error} darkMode={darkMode} />}

        {!loading && !error && (
          <>
            {/* Overview stats */}
            <CompletionStatistics assignments={assignments} darkMode={darkMode} />

            {/* Main: list + sidebar */}
            <div className="flex flex-col xl:flex-row gap-6">

              {/* Left column */}
              <div className="flex-1 min-w-0 flex flex-col gap-5">

                {/* Filter card */}
                <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
                  {/* Filter label row */}
                  <div className={`flex items-center gap-2 px-5 py-3 border-b transition-colors ${darkMode ? "border-slate-700 bg-slate-800/60" : "border-gray-100 bg-gray-50/60"}`}>
                    <SlidersHorizontal className={`w-3.5 h-3.5 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />
                    <span className={`text-[11px] font-semibold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                      Filters
                    </span>
                  </div>

                  {/* Filter controls */}
                  <div className="px-5 py-4">
                    <div className="app-filter-bar flex items-center gap-3 flex-wrap">
                      <SearchAssignment value={searchTerm} onChange={setSearchTerm} darkMode={darkMode} />
                      <StatusFilter value={status} onChange={setStatus} darkMode={darkMode} />
                      <SubjectFilter value={subject} onChange={setSubject} subjects={subjects} darkMode={darkMode} />

                      {/* View toggle */}
                      <div className={`ml-auto flex items-center gap-1 p-1 rounded-xl shrink-0 ${darkMode ? "bg-slate-700" : "bg-gray-100"}`}>
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            viewMode === "grid"
                              ? darkMode ? "bg-slate-600 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
                              : darkMode ? "text-slate-400 hover:text-slate-200" : "text-gray-400 hover:text-gray-600"
                          }`}
                          aria-label="Grid view"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("table")}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            viewMode === "table"
                              ? darkMode ? "bg-slate-600 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
                              : darkMode ? "text-slate-400 hover:text-slate-200" : "text-gray-400 hover:text-gray-600"
                          }`}
                          aria-label="Table view"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result count */}
                <p className={`text-xs font-medium px-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                  {isFiltered ? (
                    <>
                      <span className={`font-bold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>{filteredAssignments.length}</span>
                      {" "}of{" "}
                      <span className={`font-bold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>{assignments.length}</span>
                      {" "}assignments
                    </>
                  ) : (
                    <>
                      <span className={`font-bold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>{assignments.length}</span>
                      {" "}assignment{assignments.length !== 1 ? "s" : ""}
                    </>
                  )}
                </p>

                {/* Grid / Table */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAssignments.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        onClick={handleSelectAssignment}
                        darkMode={darkMode}
                      />
                    ))}

                    {filteredAssignments.length === 0 && (
                      <div className={`col-span-full rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
                          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${darkMode ? "bg-slate-800 border-slate-600" : "bg-blue-50 border-blue-100"}`}>
                            <ClipboardList className={`w-7 h-7 ${darkMode ? "text-blue-400/50" : "text-blue-300"}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-gray-800"}`}>No assignments found</p>
                            <p className={`text-xs mt-1 max-w-xs leading-relaxed ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                              Try adjusting your search or filter criteria.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <AssignmentTable
                    assignments={filteredAssignments}
                    onRowClick={handleSelectAssignment}
                    darkMode={darkMode}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className="xl:w-72 shrink-0">
                <DeadlineTracker assignments={assignments} darkMode={darkMode} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
