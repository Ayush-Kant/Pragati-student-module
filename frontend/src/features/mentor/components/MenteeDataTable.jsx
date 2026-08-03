import React from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

export default function MenteeDataTable({
  mentees = [],
  loading = false,
  onViewProfile,
  currentPage,
  setCurrentPage,
  totalPages,
  totalEntries,
  itemsPerPage
}) {
  const getProgressColor = (progress, status) => {
    if (progress === 100 || status === "COMPLETED") {
      return {
        text: "text-purple-600 font-semibold",
        bar: "bg-purple-600",
        track: "bg-purple-100",
      };
    }
    if (status === "AT RISK" || progress < 50) {
      return {
        text: "text-rose-600 font-semibold",
        bar: "bg-rose-600",
        track: "bg-rose-100",
      };
    }
    if (status === "ACTIVE" || progress >= 70) {
      return {
        text: "text-blue-600 font-semibold",
        bar: "bg-blue-600",
        track: "bg-blue-100",
      };
    }
    return {
      text: "text-slate-500 font-medium",
      bar: "bg-slate-400",
      track: "bg-slate-100",
    };
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            ACTIVE
          </span>
        );
      case "AT RISK":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-100">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            AT RISK
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
            COMPLETED
          </span>
        );
      case "INACTIVE":
        default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            INACTIVE
          </span>
        );
    }
  };

  // Helper to generate initials
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalEntries);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-500">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4.5 font-bold">Student</th>
              <th scope="col" className="px-6 py-4.5 font-bold">Course</th>
              <th scope="col" className="px-6 py-4.5 font-bold">Batch</th>
              <th scope="col" className="px-6 py-4.5 font-bold">Progress</th>
              <th scope="col" className="px-6 py-4.5 font-bold">Attendance</th>
              <th scope="col" className="px-6 py-4.5 font-bold">Last Active</th>
              <th scope="col" className="px-6 py-4.5 font-bold">Status</th>
              <th scope="col" className="relative px-6 py-4.5 font-semibold text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#004ac6] border-t-transparent"></div>
                    <span>Loading student records...</span>
                  </div>
                </td>
              </tr>
            ) : mentees.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                  No student records found matching your filters.
                </td>
              </tr>
            ) : (
              mentees.map((student) => {
                const progColors = getProgressColor(student.progress, student.status);
                return (
                  <tr
                    key={student.id}
                    onClick={() => onViewProfile(student.id)}
                    className="group cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-600 transition-transform group-hover:scale-105">
                          {student.avatarUrl ? (
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials(student.name) || <User className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 transition-colors group-hover:text-[#004ac6]">
                            {student.name}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {student.course}
                    </td>

                    {/* Batch */}
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {student.batch}
                    </td>

                    {/* Progress */}
                    <td className="px-6 py-4">
                      <div className="w-[120px]">
                        <span className={`text-xs ${progColors.text}`}>
                          {student.progress}%
                        </span>
                        <div className={`mt-1.5 h-1.5 w-full rounded-full ${progColors.track}`}>
                          <div
                            className={`h-1.5 rounded-full ${progColors.bar}`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {student.attendance}
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {student.lastActive}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      {getStatusBadge(student.status)}
                    </td>

                    {/* Action trigger */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProfile(student.id);
                        }}
                        className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-100 transition-colors hover:bg-[#004ac6] hover:text-white hover:border-[#004ac6]"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && totalEntries > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-400">
            Showing <span className="text-slate-600 font-bold">{startIndex}</span> to{" "}
            <span className="text-slate-600 font-bold">{endIndex}</span> of{" "}
            <span className="text-slate-600 font-bold">{totalEntries}</span> students
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#004ac6] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  } cursor-pointer`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
