import { Building2, Briefcase, IndianRupee, CircleCheckBig } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { formatPackage } from "../../utils/studentNominationHelpers";
import StatusBadge from "../common/StatusBadge";

const ShortlistCard = ({ student, variant = "dashboard" }) => {
  const { darkMode } = useOutletContext();

  /* =====================================
        FALLBACK VALUES
  ====================================== */
  const studentName = student?.student || "--";
  const company = student?.company || "--";
  const role = student?.role || "--";
  const packageValue = formatPackage(student?.package);
  const shortlistedDate = student?.shortlistedDate || "--";
  const companyInitial = student?.company?.charAt(0) || "?";

  /* =====================================
        Compact Variant
  ====================================== */
  if (variant === "compact") {
    return (
      <div
        className={`relative group cursor-pointer rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col justify-between ${
          darkMode
            ? "border-slate-700/60 bg-[#151D30] hover:border-slate-500"
            : "border-slate-200 bg-white hover:border-blue-300"
        }`}
      >
        <div>
          {/* Selected Badge */}
          {student?.selected && (
            <div
              className={`absolute right-4 top-4 flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                darkMode
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <CircleCheckBig size={14} strokeWidth={2.4} />
              <span>Selected</span>
            </div>
          )}

          {/* Student Name */}
          <h3 className={`truncate text-lg font-semibold pr-20 ${darkMode ? "group-hover:text-blue-400" : "group-hover:text-blue-600"}`}>
            {studentName}
          </h3>

          {/* Role */}
          <div className={`mt-4 flex items-center gap-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            <Briefcase size={16} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{role}</span>
          </div>

          {/* Package */}
          <div className={`mt-3 flex items-center gap-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            <IndianRupee size={16} strokeWidth={2} className="shrink-0" />
            <span>{packageValue}</span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-5 pt-2">
          <StatusBadge status={student.status} />
        </div>
      </div>
    );
  }

  /* =====================================
        Dashboard Variant
  ====================================== */
  return (
    <div
      className={`group flex h-full cursor-pointer flex-col rounded-2xl border px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        darkMode
          ? "border-slate-700/60 bg-[#151D30] hover:border-slate-500 hover:shadow-black/25"
          : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl border text-2xl font-bold shadow-md transition-all group-hover:-translate-y-1 ${
            darkMode
              ? "border-slate-700 bg-slate-800/80 text-slate-200 group-hover:shadow-blue-500/20"
              : "border-slate-200 bg-slate-100 text-slate-700 group-hover:shadow-blue-300/40"
          }`}
        >
          {student.logo ? (
            <img src={student.logo} alt={company} className="h-full w-full rounded-2xl object-cover" />
          ) : (
            companyInitial
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`truncate text-lg font-semibold transition-colors ${darkMode ? "group-hover:text-blue-400" : "group-hover:text-blue-500"}`}>
            {studentName}
          </h3>

          <p className={`mt-2 flex items-center gap-2 truncate text-sm ${darkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-700"}`}>
            <Building2 size={16} strokeWidth={1.8} className={darkMode ? "text-slate-400" : "text-slate-600"} />
            <span className="truncate">{company}</span>
          </p>
        </div>
      </div>

      <div className={`my-5 border-t ${darkMode ? "border-slate-700/40" : "border-slate-200"}`} />

      <div className="mt-auto flex items-center justify-between text-xs">
        <span className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Shortlisted</span>
        <span className={darkMode ? "text-slate-400" : "text-slate-500"}>{shortlistedDate}</span>
      </div>
    </div>
  );
};

export default ShortlistCard;