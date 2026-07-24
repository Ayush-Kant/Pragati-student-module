import { useOutletContext } from "react-router-dom";
import { Eye, UserPlus, CircleUserRound } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { statusStyles } from "../../constants/studentNominationConstants";

const NominationTable = ({
  totalStudents,
  students,
  selectedStudent,
  isDetailOpen,
  setSelectedStudent,
  setIsDetailOpen,
  onNominate,
}) => {
  const { darkMode } = useOutletContext();
  const compactView = isDetailOpen;

  const handleViewStudent = (student) => {
    if (selectedStudent?.id === student.id && isDetailOpen) {
      setSelectedStudent(null);
      setIsDetailOpen(false);
      return;
    }
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const fullGrid = "grid grid-cols-[2.4fr_1.3fr_1.7fr_0.7fr_1fr_1.3fr_0.9fr]";
  const compactGrid = "grid grid-cols-[3fr_1.5fr_1fr]";

  const headerClass = `h-14 px-5 flex items-center text-xs font-semibold uppercase tracking-wider ${
    darkMode ? "bg-[#1A1A1A]/60 text-gray-300 border-b border-[#3D3D3D]" : "bg-slate-50 text-slate-500 border-b border-slate-200"
  }`;

  const rowClass = `h-16 px-5 flex items-center min-w-0 ${darkMode ? "border-b border-[#3D3D3D]" : "border-b border-slate-200"}`;

  return (
    <div className={`w-full overflow-hidden rounded-3xl border transition-all duration-300 ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D] shadow-lg shadow-black/20" : "bg-white border-slate-200 shadow-lg"
    }`}>
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold">Eligible Students</h2>
        <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{totalStudents} eligible students</p>
      </div>
      <div className={`border-t ${darkMode ? "border-slate-700/70" : "border-slate-200"}`} />

      <div className="h-142 overflow-y-auto">
        {!compactView ? (
          <div className={`${fullGrid} sticky top-0 z-10`}>
            <div className={headerClass}>Student</div>
            <div className={headerClass}>Enrollment</div>
            <div className={headerClass}>Department</div>
            <div className={headerClass}>CGPA</div>
            <div className={`${headerClass} justify-center`}>Status</div>
            <div className={`${headerClass} justify-center`}>Company</div>
            <div className={`${headerClass} justify-center`}>Action</div>
          </div>
        ) : (
          <div className={`${compactGrid} sticky top-0 z-10`}>
            <div className={headerClass}>Student</div>
            <div className={`${headerClass} justify-center`}>Company</div>
            <div className={`${headerClass} justify-center`}>Action</div>
          </div>
        )}

        <div>
          {students.map((student) => {
            // FIXED: Added safe execution context fallback object tracking to shield against missing data keys
            const currentStyle = statusStyles && statusStyles[student.status] ? statusStyles[student.status] : (statusStyles?.Eligible || { avatar: { dark: "text-blue-400", light: "text-blue-600" } });
            const { avatar } = currentStyle;

            return (
              <div
                key={student.id}
                className={`${compactView ? compactGrid : fullGrid} transition-colors ${darkMode ? "hover:bg-slate-800/70" : "hover:bg-slate-50"}`}
              >
                <div className={rowClass}>
                  <div className="flex min-w-0 items-center gap-3">
                    <CircleUserRound size={24} className={`shrink-0 ${darkMode ? avatar.dark : avatar.light}`} />
                    <span className="truncate font-medium">{student.name}</span>
                  </div>
                </div>

                {!compactView && (
                  <>
                    <div className={`${rowClass} whitespace-nowrap`}>{student.enrollmentNo}</div>
                    <div className={rowClass}><span className="truncate">{student.department}</span></div>
                    <div className={rowClass}>{student.cgpa}</div>
                  </>
                )}

                <div className={`${rowClass} justify-center`}><span className="truncate">{student.company || "--"}</span></div>

                {!compactView && (
                  <div className={`${rowClass} justify-center`}><StatusBadge status={student.status} /></div>
                )}

                <div className={`${rowClass} justify-center`}>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewStudent(student)}
                      title="View Details"
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                        selectedStudent?.id === student.id && isDetailOpen
                          ? `${darkMode ? "bg-[#ff6d34] text-white" : "bg-[#ff7a00] text-white"}`
                          : darkMode ? "bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D]" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      onClick={() => onNominate(student)}
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