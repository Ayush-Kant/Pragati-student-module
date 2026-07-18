import { useOutletContext } from "react-router-dom";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { getInitials, getTopBorder, formatDate, } from "../../utils/studentNominationHelpers";
import {
  Building2,
  Briefcase,
  Star,
  IndianRupee,
  CalendarDays,
  Eye,
  Pencil,
  RotateCcw,
  Trash2,
  BadgeCheck,
  CheckCircle2,
  Search,
  SearchX,
} from "lucide-react";


const NominationCard = ({
  students = [],
  hasSearched = false,
  onBrowseStudents,

  selectedStudent,
  isDetailOpen,

  onViewStudent,
  onEditNomination,
  onRemoveNomination,
  onReNominate,
  onMarkSelected,

  getStudentActions,
}) => {
  const { darkMode } = useOutletContext();


  // Nothing searched yet

  if (!hasSearched) {
    return (
      <EmptyState
        icon={Search}
        title="Find a Student"
        description="Search by student name or enrollment number to nominate, review or update placement status."
        className="min-h-[420px]"
      />
    );
  }

  // Search completed but no result

  if (students.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No Student Found"
        description="We couldn't find any student matching your search. Try another name or enrollment number."
        className="min-h-[420px]"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {students.map((student) => {
        const actions = getStudentActions ? getStudentActions(student) : {};

        return (
          <div
            key={student.id}
            className={`overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              darkMode
                ? "border-slate-700 bg-[#151D30]"
                : "border-slate-200 bg-white"
            } ${getTopBorder(student.status)}`}
          >
            {/* =========================
                  Header
            ========================= */}

            <div className="p-5">
              <div className="flex items-start justify-between">
                {/* Avatar + Name */}

                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold ${
                      darkMode
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {getInitials(student.name)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">
                      {student.name}
                    </h3>

                    <p
                      className={`mt-1 text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {student.enrollmentNo}
                    </p>
                  </div>
                </div>

                <StatusBadge status={student.status} />
              </div>
              {/* =========================
                    Information
              ========================= */}

              <div
                className={`mt-5 space-y-4 border-t pt-5 ${
                  darkMode ? "border-slate-700" : "border-slate-200"
                }`}
              >
                {/* Company */}

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      darkMode
                        ? "bg-violet-500/15 text-violet-400"
                        : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    <Building2 size={18} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      Company
                    </p>

                    <p className="truncate text-sm font-semibold">
                      {student.company ?? "--"}
                    </p>
                  </div>
                </div>

                {/* Role */}

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      darkMode
                        ? "bg-sky-500/15 text-sky-400"
                        : "bg-sky-100 text-sky-600"
                    }`}
                  >
                    <Briefcase size={18} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      Role
                    </p>

                    <p className="truncate text-sm font-semibold">
                      {student.role ?? "--"}
                    </p>
                  </div>
                </div>
                {/* Stats */}

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-slate-700 bg-slate-800/40"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Star size={15} className="text-amber-500" />

                      <span
                        className={`text-xs ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        CGPA
                      </span>
                    </div>

                    <p className="text-lg font-bold">{student.cgpa ?? "--"}</p>
                  </div>

                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-slate-700 bg-slate-800/40"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <IndianRupee size={15} className="text-emerald-500" />

                      <span
                        className={`text-xs ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Package
                      </span>
                    </div>

                    <p className="truncate text-lg font-bold">
                      {formatPackage(student.package)}
                    </p>
                  </div>
                </div>
                {/* Date */}

                <div
                  className={`flex items-center gap-3 border-t pt-4 ${
                    darkMode ? "border-slate-700" : "border-slate-200"
                  }`}
                >
                  <CalendarDays size={17} className="text-slate-400" />

                  <span
                    className={`text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {formatDate(student.nominatedDate)}
                  </span>
                </div>
              </div>
              {/* =========================
                    Actions
              ========================= */}

              <div
                className={`mt-5 flex items-center justify-between border-t pt-5 ${
                  darkMode ? "border-slate-700" : "border-slate-200"
                }`}
              >
                {/* View */}

                <button
                  onClick={() => onViewStudent?.(student)}
                  title="View Details"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                    selectedStudent?.id === student.id && isDetailOpen
                      ? darkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : darkMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Eye size={18} strokeWidth={2} />
                </button>

                {/* Edit */}

                {actions.canEdit && (
                  <button
                    onClick={() => onEditNomination?.(student)}
                    title="Edit Nomination"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                      darkMode
                        ? "bg-amber-600 text-white hover:bg-amber-500"
                        : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                  >
                    <Pencil size={18} strokeWidth={2} />
                  </button>
                )}

                {/* Re-Nominate */}

                {actions.canReNominate && (
                  <button
                    onClick={() => onReNominate?.(student)}
                    title="Re-Nominate"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                      darkMode
                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                  >
                    <RotateCcw size={18} strokeWidth={2} />
                  </button>
                )}

                {/* Remove */}

                {actions.canRemove && (
                  <button
                    onClick={() => onRemoveNomination?.(student)}
                    title="Remove Nomination"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                      darkMode
                        ? "bg-red-600 text-white hover:bg-red-500"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>
                )}

                {/* Mark Selected */}

                {actions.canMarkSelected && (
                  <button
                    onClick={() => onMarkSelected?.(student)}
                    title="Mark as Selected"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                      darkMode
                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    <BadgeCheck size={18} strokeWidth={2} />
                  </button>
                )}

                {/* Already Selected */}

                {actions.isSelected && (
                  <div
                    title="Selected"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      darkMode
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <CheckCircle2 size={18} strokeWidth={2} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NominationCard;
