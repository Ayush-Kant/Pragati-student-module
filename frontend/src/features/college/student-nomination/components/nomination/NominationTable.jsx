import { useOutletContext } from "react-router-dom";
import { Eye, UserPlus, CircleUserRound, CheckSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import { getStatusStyles } from "../../constants/studentNominationConstants";

const NominationTable = ({
  totalStudents = 0,
  students = [],
  selectedStudent,
  isDetailOpen,
  setSelectedStudent,
  setIsDetailOpen,
  onNominate,
  isLoading = false,
  isError = false,
  errorMessage = "Failed to load eligible candidates.",
  onRetry,
  selectedIds = [],
  onToggleSelect = null,
  onSelectAll = null,
}) => {
  // Safe context fallback
  const { darkMode = false } = useOutletContext() || {};
  const compactView = Boolean(isDetailOpen);

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
          Loading eligible student roster...
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
        title="No Eligible Students"
        description="No eligible candidates found matching the selected criteria."
      />
    );
  }

  const allSelected =
    students.length > 0 &&
    students.every((s) => selectedIds.includes(s.id || s._id || s.student_id));

  const handleViewStudent = (student) => {
    const sId = student.id || student._id || student.student_id;
    const currentSelectedId =
      selectedStudent?.id || selectedStudent?._id || selectedStudent?.student_id;

    if (currentSelectedId === sId && isDetailOpen) {
      setSelectedStudent(null);
      setIsDetailOpen(false);
      return;
    }
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const handleNominateClick = async (student) => {
    try {
      if (onNominate) {
        const result = await onNominate(student);
        if (result?.isValid === false) {
          toast.error(result.errors?.service || "Validation failed for nomination.");
        } else {
          toast.success(`Successfully nominated ${student.name || student.student_name}!`);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit student nomination.");
    }
  };

  // Safe Grid Column Layout Specs
  const gridTemplate = compactView
    ? onToggleSelect
      ? "grid-cols-[40px_3fr_1.5fr_1fr]"
      : "grid-cols-[3fr_1.5fr_1fr]"
    : onToggleSelect
    ? "grid-cols-[40px_2.4fr_1.3fr_1.7fr_0.7fr_1fr_1.3fr_0.9fr]"
    : "grid-cols-[2.4fr_1.3fr_1.7fr_0.7fr_1fr_1.3fr_0.9fr]";

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
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold">Eligible Students</h2>
        <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {totalStudents} eligible candidates total
        </p>
      </div>
      <div className={`border-t ${darkMode ? "border-slate-700/70" : "border-slate-200"}`} />

      <div className="h-[568px] overflow-y-auto">
        <div className={`grid ${gridTemplate} sticky top-0 z-10`}>
          {onToggleSelect && (
            <div className={`${headerClass} justify-center`}>
              {onSelectAll ? (
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#ff7a00] cursor-pointer"
                  aria-label="Select all students"
                />
              ) : (
                <CheckSquare size={14} />
              )}
            </div>
          )}
          <div className={headerClass}>Student</div>
          {!compactView && (
            <>
              <div className={headerClass}>Enrollment</div>
              <div className={headerClass}>Department</div>
              <div className={headerClass}>CGPA</div>
            </>
          )}
          <div className={`${headerClass} justify-center`}>Company</div>
          {!compactView && (
            <div className={`${headerClass} justify-center`}>Status</div>
          )}
          <div className={`${headerClass} justify-center`}>Action</div>
        </div>

        <div>
          {students.map((student, idx) => {
            const studentId = student.id || student._id || student.student_id || idx;
            const studentName = student.name || student.student_name || student.student || "--";
            const currentStyle = getStatusStyles(student.status) || {};
            const avatar = currentStyle.avatar || { dark: "text-slate-400", light: "text-slate-500" };

            const isCurrentSelected =
              (selectedStudent?.id || selectedStudent?._id || selectedStudent?.student_id) === studentId;

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
                      className={`shrink-0 ${darkMode ? avatar?.dark : avatar?.light}`}
                    />
                    <span className="truncate font-medium">{studentName}</span>
                  </div>
                </div>

                {!compactView && (
                  <>
                    <div className={`${rowClass} whitespace-nowrap`}>
                      {student.enrollmentNo || student.enrollment_no || "—"}
                    </div>
                    <div className={rowClass}>
                      <span className="truncate">{student.department || student.dept || "—"}</span>
                    </div>
                    <div className={rowClass}>{student.cgpa ?? "—"}</div>
                  </>
                )}

                <div className={`${rowClass} justify-center`}>
                  <span className="truncate">{student.company || student.company_name || "—"}</span>
                </div>

                {!compactView && (
                  <div className={`${rowClass} justify-center`}>
                    <StatusBadge status={student.status} />
                  </div>
                )}

                <div className={`${rowClass} justify-center`}>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewStudent(student)}
                      title="View Details"
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                        isCurrentSelected && isDetailOpen
                          ? darkMode
                            ? "bg-[#ff6d34] text-white"
                            : "bg-[#ff7a00] text-white"
                          : darkMode
                          ? "bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D]"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNominateClick(student)}
                      title="Nominate Student"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff7a00] text-white hover:bg-[#e06b00] transition-all duration-200"
                    >
                      <UserPlus size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NominationTable;