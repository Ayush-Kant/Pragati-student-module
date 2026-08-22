import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import ShortlistCard from "./ShortlistCard";
import CompanyShortlist from "./CompanyShortlist";

const ShortlistedStudents = ({ 
  shortlistedData = [], 
  isLoading = false, 
  error = null,
  limit,
  onSelectStudent,
  onRemoveShortlist,
  onRefresh,
}) => {
  // Safe destructuring in case component is used outside an Outlet context
  const outletContext = useOutletContext() || {};
  const darkMode = outletContext.darkMode ?? false;

  const [showAll, setShowAll] = useState(false);

  /* =====================================
        Latest Shortlisted Students
  ====================================== */
  const currentLimit = limit !== undefined ? limit : 4;
  const latestShortlists = shortlistedData.slice(0, currentLimit);

  /* =====================================
        Company-wise View
  ====================================== */
  if (showAll) {
    return (
      <div className="w-full max-w-full min-w-0 overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Shortlisted Students
            </h2>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Browse shortlisted students grouped by company.
            </p>
          </div>

          <button
            onClick={() => setShowAll(false)}
            className={`group flex items-center gap-2 transition-colors ${
              darkMode
                ? "text-[#ff6d34] hover:text-[#ff8a5c]"
                : "text-[#ff7a00] hover:text-[#e06b00]"
            }`}
          >
            <ArrowLeft
              size={18}
              strokeWidth={2.2}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Back</span>
          </button>
        </div>

        <div className="w-full max-w-full min-w-0 overflow-hidden">
          <CompanyShortlist 
            data={shortlistedData}
            onSelectStudent={onSelectStudent}
            onRemoveShortlist={onRemoveShortlist}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    );
  }

  /* =====================================
        Dashboard View
  ====================================== */
  return (
    <div
      className={`rounded-3xl p-6 shadow-lg ${
        darkMode ? "bg-[#2D2D2D]" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2
            className={`text-2xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Shortlisted Students
          </h2>

          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Latest placement shortlists
          </p>
        </div>

        <button
          onClick={() => setShowAll(true)}
          className={`group flex items-center gap-2 transition-colors ${
            darkMode
              ? "text-[#ff6d34] hover:text-[#ff8a5c]"
              : "text-[#ff7a00] hover:text-[#e06b00]"
          }`}
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            View All
          </span>
          <ArrowRight
            size={18}
            strokeWidth={2.2}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-56 items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#ff7a00]" size={28} />
          <span className={darkMode ? "text-slate-400" : "text-slate-500"}>
            Loading shortlist records...
          </span>
        </div>
      ) : error ? (
        <div className={`col-span-full flex h-56 items-center justify-center rounded-2xl border ${
          darkMode ? "border-red-900/40 bg-red-950/20 text-red-400" : "border-red-200 bg-red-50 text-red-600"
        }`}>
          Failed to load shortlist data from backend.
        </div>
      ) : (
        /* Latest Shortlisted Students */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {latestShortlists.length > 0 ? (
            latestShortlists.map((student, idx) => (
              <ShortlistCard 
                key={student.id || student._id || idx} 
                student={student}
                onSelectStudent={onSelectStudent}
                onRemoveShortlist={onRemoveShortlist}
              />
            ))
          ) : (
            <div
              className={`col-span-full flex h-56 items-center justify-center rounded-2xl border ${
                darkMode
                  ? "border-slate-700 bg-slate-800/30 text-slate-400"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              No shortlisted students available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortlistedStudents;