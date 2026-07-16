// AssignmentsPage.jsx
// Purpose: Tabbed list of all student assignments organised by status: pending, submitted, and graded (SM-06)

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAssignments from "../../assignments/hooks/useAssignments";
import useAssignmentFilters from "../../assignments/hooks/useAssignmentFilters";
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
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* ─────────────────────────────────────────────────────────────
          Hero header — premium, white, sticky
          Large icon · bold headline · subtitle · count badge
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 py-5">

            {/* Left: icon + text */}
            <div className="flex items-center gap-4">
              {/* Large gradient icon with ring + shadow */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-400/30">
                  <ClipboardList className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                {/* Subtle outer ring */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-600/20 ring-offset-1" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                  Assignments
                </h1>
                <p className="text-sm text-gray-500 mt-1 leading-none">
                  Track, submit and review your course assignments
                </p>
              </div>
            </div>

            {/* Right: count badge */}
            {!loading && !error && (
              <div className="hidden sm:flex items-center shrink-0">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200/80 px-3 py-2 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  {assignments.length} assignments
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Page body
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

        {loading && <SkeletonAssignmentPage />}
        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            {/* Overview stats */}
            <CompletionStatistics assignments={assignments} />

            {/* Main: list + sidebar */}
            <div className="flex flex-col xl:flex-row gap-6">

              {/* Left column */}
              <div className="flex-1 min-w-0 flex flex-col gap-5">

                {/* Filter card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Filter label row */}
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                      Filters
                    </span>
                  </div>

                  {/* Filter controls */}
                  <div className="px-5 py-4">
                    <div className="app-filter-bar flex items-center gap-3 flex-wrap">
                      <SearchAssignment value={searchTerm} onChange={setSearchTerm} />
                      <StatusFilter value={status} onChange={setStatus} />
                      <SubjectFilter value={subject} onChange={setSubject} subjects={subjects} />

                      {/* View toggle */}
                      <div className="ml-auto flex items-center gap-1 p-1 bg-gray-100 rounded-xl shrink-0">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            viewMode === "grid"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                          aria-label="Grid view"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("table")}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            viewMode === "table"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-400 hover:text-gray-600"
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
                <p className="text-xs font-medium text-gray-400 px-1">
                  {isFiltered ? (
                    <>
                      <span className="font-bold text-gray-700">{filteredAssignments.length}</span>
                      {" "}of{" "}
                      <span className="font-bold text-gray-700">{assignments.length}</span>
                      {" "}assignments
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-gray-700">{assignments.length}</span>
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
                      />
                    ))}

                    {filteredAssignments.length === 0 && (
                      <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <ClipboardList className="w-7 h-7 text-blue-300" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">No assignments found</p>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
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
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className="xl:w-72 shrink-0">
                <DeadlineTracker assignments={assignments} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
