import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import {
  Building2,
  Briefcase,
  Star,
  IndianRupee,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Pencil,
  RotateCcw,
  Trash2,
  BadgeCheck,
  CheckCircle2,
  SearchX,
  GraduationCap,
  MessageSquare,
  UserPlus
} from "lucide-react";

// LOCAL HELPERS TO PREVENT IMPORT OVERRIDES
const getInitials = (name = "") => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPackage = (pkg) => {
  if (!pkg) return "--";
  return `₹${pkg} LPA`;
};

// Fixed Border mapping using consistent status themes
const getTopBorder = (status) => {
  switch (status) {
    case "Eligible":
      return "border-t-4 border-t-emerald-500";
    case "Waiting":
      return "border-t-4 border-t-amber-500";
    case "Shortlisted":
      return "border-t-4 border-t-violet-500";
    case "Nominated":
      return "border-t-4 border-t-blue-500";
    case "Rejected":
      return "border-t-4 border-t-red-500";
    default:
      return "border-t-4 border-t-slate-500";
  }
};

const NominationCard = ({
  students = [],
  hasSearched = true,
  activeTab,
  onNominate,
  onEditNomination,
  onRemoveNomination,
  onReNominate,
  onMarkSelected,
  getStudentActions,
}) => {
  const { darkMode } = useOutletContext();
  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleCardExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  if (students.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No Student Found"
        description="We couldn't find any student matching your selection criteria rules."
        className="min-h-[420px]"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {students.map((student) => {
        const actions = getStudentActions ? getStudentActions(student) : {};
        const isExpanded = expandedCardId === student.id;

        // Dynamic base backgrounds and side/bottom borders
        const baseThemeClass = darkMode 
          ? "border-slate-800 bg-[#151D30]" 
          : "border-slate-200 bg-white";

        return (
          <div
            key={student.id}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 shadow-sm ${baseThemeClass} ${getTopBorder(student.status)}`}
          >
            {/* Clickable Header Area */}
            <div 
              onClick={() => toggleCardExpand(student.id)}
              className="p-5 flex items-start justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                    darkMode ? "bg-blue-500/15 text-blue-400" : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {getInitials(student.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{student.name}</h3>
                  <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {student.enrollmentNo}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={student.status} />
                <div className={`p-1.5 rounded-lg border ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>

            {/* Expandable Table Values Section */}
            {isExpanded && (
              <div className={`px-5 pb-5 pt-4 border-t flex flex-col gap-4 transition-all duration-200 ${
                darkMode ? "border-slate-800 bg-[#121929]/40" : "border-slate-100 bg-slate-50/60"
              }`}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${darkMode ? "bg-violet-500/15 text-violet-400" : "bg-violet-100 text-violet-600"}`}>
                      <Building2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Company</p>
                      <p className="truncate text-sm font-semibold">{student.company ?? "--"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${darkMode ? "bg-sky-500/15 text-sky-400" : "bg-sky-100 text-sky-600"}`}>
                      <Briefcase size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Role</p>
                      <p className="truncate text-sm font-semibold">{student.role ?? "--"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${darkMode ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
                      <GraduationCap size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Department</p>
                      <p className="truncate text-sm font-semibold">{student.department ?? "--"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${darkMode ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
                      <CalendarDays size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Batch Year</p>
                      <p className="truncate text-sm font-semibold">{student.batch ?? "--"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-2xl border p-4 ${darkMode ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-slate-50"}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <Star size={15} className="text-amber-500" />
                      <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>CGPA</span>
                    </div>
                    <p className="text-base font-bold">{student.cgpa ?? "--"}</p>
                  </div>

                  <div className={`rounded-2xl border p-4 ${darkMode ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-slate-50"}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <IndianRupee size={15} className="text-emerald-500" />
                      <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Package</span>
                    </div>
                    <p className="truncate text-base font-bold">{formatPackage(student.package)}</p>
                  </div>
                </div>

                {student.remarks && (
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      <MessageSquare size={14} /> Remarks
                    </span>
                    <p className={`p-3 rounded-2xl border text-xs italic ${
                      darkMode ? "bg-slate-800/60 border-slate-700 text-slate-300" : "bg-white border-slate-100 text-slate-600"
                    }`}>{student.remarks}</p>
                  </div>
                )}

                {student.nominatedDate && (
                  <div className={`flex items-center gap-2 text-xs border-t pt-3 ${darkMode ? "border-slate-700/60 text-slate-500" : "border-slate-200 text-slate-400"}`}>
                    <CalendarDays size={14} />
                    <span>Nominated on {formatDate(student.nominatedDate)}</span>
                  </div>
                )}

                {/* Bottom Action Footer Row */}
                <div className={`flex items-center justify-end gap-2 pt-4 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                  {activeTab === "eligible" ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); onNominate?.(student); }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-xs"
                    >
                      <UserPlus size={15} /> Nominate Student
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {actions.canEdit && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onEditNomination?.(student); }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200"
                          title="Edit Nomination"
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                      )}

                      {actions.canReNominate && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onReNominate?.(student); }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-200"
                          title="Re-Nominate"
                        >
                          <RotateCcw size={16} strokeWidth={2} />
                        </button>
                      )}

                      {actions.canRemove && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveNomination?.(student); }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                          title="Remove Nomination"
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      )}

                      {actions.canMarkSelected && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onMarkSelected?.(student); }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200"
                          title="Mark as Selected"
                        >
                          <BadgeCheck size={16} strokeWidth={2} />
                        </button>
                      )}

                      {actions.isSelected && (
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${darkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`} title="Selected">
                          <CheckCircle2 size={16} strokeWidth={2} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NominationCard;