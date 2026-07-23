import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { shortlistedStudents } from "../../types/studentNominationDummyData";

import ShortlistCard from "./ShortlistCard";
import CompanyShortlist from "./CompanyShortlist";

// MODIFIED: Accept the limit prop here
const ShortlistedStudents = ({ limit }) => {
  const { darkMode } = useOutletContext();
  const [showAll, setShowAll] = useState(false);

  /* =====================================
        Latest Shortlisted Students
  ====================================== */
  // MODIFIED: Fallback to a default slice of 4 if limit isn't provided (e.g., on desktop)
  const currentLimit = limit !== undefined ? limit : 4;
  const latestShortlists = shortlistedStudents.slice(0, currentLimit);

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
          <CompanyShortlist />
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

      {/* Latest Shortlisted Students */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {latestShortlists.length > 0 ? (
          latestShortlists.map((student) => (
            <ShortlistCard key={student.id} student={student} />
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
    </div>
  );
};

export default ShortlistedStudents;