import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  CircleUserRound,
  BadgeCheck,
  HelpCircle,
  Loader2,
  CheckSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import { getStatusStyles } from "../../constants/studentNominationConstants";

const NominatedTable = ({
  totalStudents = 0,
  students = [],
  selectedStudent,
  isDetailOpen,
  setSelectedStudent,
  setIsDetailOpen,
  onEditNomination,
  onRemoveNomination,
  onReNominate,
  onMarkSelected,
  isLoading = false,
  isError = false,
  errorMessage = "Failed to load nominated students data.",
  onRetry,
  selectedIds = [],
  onToggleSelect = null,
}) => {
  // Safe outlet context fallback
  const { darkMode = false } = useOutletContext() || {};
  const compactView = isDetailOpen;

  // Inline Dialog Manager State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    student: null,
    type: "", // 'renominate' | 'select'
    title: "",
    description: "",
    actionColor: "",
    isSubmitting: false,
  });

  if (isLoading) {
    return (
      <div
        className={`w-full h-80 flex flex-col items-center justify-center rounded-3xl border gap-4 ${
          darkMode
            ? "bg-[#2D2D2D] border-[#3D3D3D] text-white"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        <Loader2 className="animate-spin text-[#ff7a00]" size={36} />
        <span className="text-sm font-medium opacity-70">
          Loading nominated student records...
        </span>
      </div>
    );
  }

  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (!students || students.length === 0) {
    return (
      <EmptyState
        title="No Nominated Students"
        description="No candidates found for the current search filter or page."
      />
    );
  }

  const handleViewStudent = (student) => {
    const studentId = student.id || student._id || student.enrollmentNo;
    const currentSelectedId = selectedStudent?.id || selectedStudent?._id;

    if (currentSelectedId === studentId && isDetailOpen) {
      setSelectedStudent(null);
      setIsDetailOpen(false);
      return;
    }
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const getAvailableActions = (status) => {
    switch (status) {
      case "Nominated":
      case "Waiting":
        return { canEdit: true, canRemove: true };
      case "Rejected":
        return { canReNominate: true };
      case "Shortlisted":
        return { canMarkSelected: true };
      case "Selected":
        return { isSelected: true };
      default:
        return { canEdit: true, canRemove: true };
    }
  };

  const requestAction = (student, type) => {
    const name = student.name || student.full_name || "Student";
    let title = "";
    let description = "";
    let actionColor = "bg-[#ff7a00] hover:bg-[#e06b00]";

    if (type === "renominate") {
      title = "Confirm Re-Nomination";
      description = `Are you sure you want to re-nominate ${name}? This will reset their interview metrics for this company cycle.`;
      actionColor = "bg-indigo-600 hover:bg-indigo-700";
    } else if (type === "select") {
      title = "Mark as Selected";
      description = `Confirm placement selection status for ${name}. This completes their recruitment path.`;
      actionColor = "bg-emerald-600 hover:bg-emerald-700";
    }

    setConfirmConfig({
      isOpen: true,
      student,
      type,
      title,
      description,
      actionColor,
      isSubmitting: false,
    });
  };

  const executeConfirmedAction = async () => {
    const { type, student } = confirmConfig;
    const name = student?.name || student?.full_name || "Student";
    setConfirmConfig((prev) => ({ ...prev, isSubmitting: true }));

    try {
      if (type === "renominate" && onReNominate) {
        await onReNominate(student);
        toast.success(`Re-nomination submitted for ${name}`);
      } else if (type === "select" && onMarkSelected) {
        const res = await onMarkSelected(student);
        if (res?.isValid === false) {
          toast.error(res.errors?.service || "Failed to update selection state.");
        } else {
          toast.success(`${name} marked as selected!`);
        }
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while processing action.");
    } finally {
      setConfirmConfig({
        isOpen: false,
        student: null,
        type: "",
        title: "",
        description: "",
        actionColor: "",
        isSubmitting: false,
      });
    }
  };

  // Safe CSS Grid Column Layout Specs
  const gridTemplate = compactView
    ? onToggleSelect
      ? "grid-cols-[40px_2.2fr_1.4fr_1.4fr]"
      : "grid-cols-[2.2fr_1.4fr_1.4fr]"
    : onToggleSelect
    ? "grid-cols-[40px_2.2fr_1.1fr_1.8fr_1.4fr_1.1fr_1.4fr_2.2fr]"
    : "grid-cols-[2.2fr_1.1fr_1.8fr_1.4fr_1.1fr_1.4fr_2.2fr]";

  const headerClass = `h-14 px-5 flex items-center text-xs font-semibold uppercase tracking-wider ${
    darkMode
      ? "bg-[#1A1A1A]/60 text-gray-300 border-b border-[#3D3D3D]"
      : "bg-slate-50 text-slate-500 border-b border-slate-200"
  }`;

  const rowClass = `h-16 px-5 flex items-center min-w-0 ${
    darkMode ? "border-b border-[#3D3D3D]" : "border-b border-slate-200"
  }`;

  return (
    <div
      className={`w-full overflow-hidden rounded-3xl border transition-all duration-300 ${
        darkMode
          ? "bg-[#2D2D2D] border-[#3D3D3D] shadow-lg shadow-black/20"
          : "bg-white border-slate-200 shadow-lg"
      }`}
    >
      {/* Table Header Wrapper */}
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold">Nominated Students</h2>
        <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {totalStudents} nominated students total
        </p>
      </div>
      <div className={`border-t ${darkMode ? "border-slate-700/70" : "border-slate-200"}`} />

      {/* Main Container */}
      <div className="h-142 overflow-y-auto overflow-x-hidden">
        <div className={`grid ${gridTemplate} sticky top-0 z-10`}>
          {onToggleSelect && (
            <div className={`${headerClass} justify-center`}>
              <CheckSquare size={14} />
            </div>
          )}
          <div className={headerClass}>Student</div>
          {!compactView && (
            <>
              <div className={headerClass}>Enrollment</div>
              <div className={headerClass}>Department</div>
            </>
          )}
          <div className={headerClass}>Company</div>
          {!compactView && (
            <>
              <div className={headerClass}>Status</div>
              <div className={headerClass}>Nominated On</div>
            </>
          )}
          <div className={`${headerClass} ${compactView ? "px-5" : "pl-6"}`}>Action</div>
        </div>

        <div>
          {students.map((student, index) => {
            const studentId = student.id || student._id || student.enrollmentNo || index;
            const studentName = student.name || student.full_name || student.student_name || "Unknown";
            const enrollmentNo = student.enrollmentNo || student.enrollment_no || "—";
            const department = student.department || student.dept || "—";
            const company = student.company || student.company_name || "—";
            const nominatedDate =
              student.timeline?.nominated || student.nominatedDate || student.created_at || "—";

            const currentStyle = getStatusStyles ? getStatusStyles(student.status) : {};
            const avatar = currentStyle?.avatar;
            const actions = getAvailableActions(student.status);

            const isSelectedForDetail =
              (selectedStudent?.id || selectedStudent?._id) === studentId && isDetailOpen;

            return (
              <div
                key={studentId}
                className={`grid ${gridTemplate} transition-colors ${
                  darkMode ? "hover:bg-slate-800/70" : "hover:bg-slate-50"
                }`}
              >
                {onToggleSelect && (
                  <div className={`${rowClass} justify-center`}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(studentId)}
                      onChange={() => onToggleSelect(studentId)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded accent-[#ff7a00] cursor-pointer"
                      aria-label={`Select ${studentName}`}
                    />
                  </div>
                )}
                <div className={rowClass}>
                  <div className="flex min-w-0 items-center gap-3">
                    <CircleUserRound
                      size={24}
                      className={`shrink-0 ${darkMode ? avatar?.dark || "text-slate-400" : avatar?.light || "text-slate-500"}`}
                    />
                    <span className="truncate font-medium">{studentName}</span>
                  </div>
                </div>

                {!compactView && (
                  <>
                    <div className={rowClass}>{enrollmentNo}</div>
                    <div className={rowClass}>
                      <span className="truncate">{department}</span>
                    </div>
                  </>
                )}

                <div className={rowClass}>
                  <span className="truncate">{company}</span>
                </div>

                {!compactView && (
                  <>
                    <div className={rowClass}>
                      <StatusBadge status={student.status} />
                    </div>
                    <div className={`${rowClass} whitespace-nowrap`}>
                      {nominatedDate}
                    </div>
                  </>
                )}

                <div className={`${rowClass} ${compactView ? "px-5" : "pl-6"} justify-start`}>
                  <div className="flex items-center gap-2 flex-nowrap shrink-0">
                    <button
                      onClick={() => handleViewStudent(student)}
                      title="View Details"
                      className={`flex h-9 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                        isSelectedForDetail
                          ? `${darkMode ? "bg-[#ff6d34] text-white" : "bg-[#ff7a00] text-white"}`
                          : darkMode
                          ? "bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D]"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Eye size={16} />
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {actions.canEdit && (
                        <button
                          onClick={() => onEditNomination?.(student)}
                          title="Edit Nomination"
                          className="flex h-9 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200"
                        >
                          <Pencil size={16} />
                        </button>
                      )}

                      {actions.canReNominate && (
                        <button
                          onClick={() => requestAction(student, "renominate")}
                          title="Re-Nominate"
                          className={`flex h-9 items-center justify-center gap-1.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-200 text-xs font-semibold whitespace-nowrap ${
                            compactView ? "w-10 shrink-0" : "px-3"
                          }`}
                        >
                          <RotateCcw size={16} className="shrink-0" />
                          {!compactView && <span className="text-[10px]">Re-Nominate</span>}
                        </button>
                      )}

                      {actions.canMarkSelected && (
                        <button
                          onClick={() => requestAction(student, "select")}
                          title="Mark as Selected"
                          className={`flex h-9 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 text-xs font-semibold whitespace-nowrap ${
                            compactView ? "w-10 shrink-0" : "px-3"
                          }`}
                        >
                          <BadgeCheck size={16} className="shrink-0" />
                          {!compactView && <span className="text-[10px]">Mark Selected</span>}
                        </button>
                      )}

                      {actions.canRemove && (
                        <button
                          onClick={() => {
                            onRemoveNomination?.(student);
                            toast.success(`Removed nomination for ${studentName}`);
                          }}
                          title="Remove Nomination"
                          className="flex h-9 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      {actions.isSelected && (
                        <div
                          title="Selected"
                          className={`flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold ${
                            darkMode
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-emerald-100 text-emerald-700"
                          } ${compactView ? "w-10 shrink-0" : "px-3"}`}
                        >
                          <BadgeCheck size={16} className="shrink-0" />
                          {!compactView && <span className="text-[10px]">Selected</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Action Confirmation Modal */}
      {confirmConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() =>
              !confirmConfig.isSubmitting &&
              setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
            }
          />

          <div
            className={`relative w-full max-w-md p-6 rounded-3xl shadow-2xl border
            ${
              darkMode
                ? "bg-[#2D2D2D] border-[#3D3D3D] text-white"
                : "bg-white border-slate-100 text-slate-800"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  darkMode ? "bg-[#ff6d34]/10 text-[#ff6d34]" : "bg-orange-100 text-[#ff7a00]"
                }`}
              >
                <HelpCircle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold tracking-tight">{confirmConfig.title}</h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {confirmConfig.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={confirmConfig.isSubmitting}
                onClick={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                  ${
                    darkMode
                      ? "bg-[#2D2D2D] text-gray-300 hover:bg-[#1A1A1A]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmConfig.isSubmitting}
                onClick={executeConfirmedAction}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all duration-150 ${confirmConfig.actionColor}`}
              >
                {confirmConfig.isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NominatedTable;