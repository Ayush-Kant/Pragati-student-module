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

  /* --------------------------------------------------------
      GRID LAYOUT (Same as NominatedTable)
  --------------------------------------------------------- */

  const fullGrid = "grid grid-cols-[2.4fr_1.3fr_1.7fr_0.7fr_1fr_1.3fr_0.9fr]";

  const compactGrid = "grid grid-cols-[3fr_1.5fr_1fr]";

  /* --------------------------------------------------------
      COMMON CLASSES
  --------------------------------------------------------- */

  const headerClass = `
    h-14
    px-5
    flex
    items-center
    text-xs
    font-semibold
    uppercase
    tracking-wider
    ${
      darkMode
        ? "bg-slate-800/40 text-slate-300 border-b border-slate-700/60"
        : "bg-slate-50 text-slate-500 border-b border-slate-200"
    }
  `;

  const rowClass = `
    h-16
    px-5
    flex
    items-center
    min-w-0
    ${darkMode ? "border-b border-slate-700/50" : "border-b border-slate-200"}
  `;

  return (
    <div
      className={`w-full overflow-hidden rounded-3xl border transition-all duration-300 ${
        darkMode
          ? "bg-[#151D30] border-slate-700/60 shadow-lg shadow-black/20"
          : "bg-white border-slate-200 shadow-lg"
      }`}
    >
      {/* Header */}

      <div className="px-6 py-5">
        <h2 className="text-xl font-bold">Eligible Students</h2>

        <p
          className={`mt-1 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {totalStudents} eligible students
        </p>
      </div>

      <div
        className={`border-t ${
          darkMode ? "border-slate-700/70" : "border-slate-200"
        }`}
      />

      {/* Table */}

      <div className="h-142 overflow-y-auto">
        {/* ===============================
            HEADER
        ================================ */}

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

        {/* Rows */}

        <div>
          {students.map((student) => {
            const { avatar } =
              statusStyles[student.status] || statusStyles.Eligible;
            return !compactView ? (
              <div
                key={student.id}
                className={`${fullGrid} transition-colors ${
                  darkMode ? "hover:bg-slate-800/70" : "hover:bg-slate-50"
                }`}
              >
                {/* Student */}

                <div className={rowClass}>
                  <div className="flex min-w-0 items-center gap-3">
                    <CircleUserRound
                      size={24}
                      strokeWidth={2}
                      className={`shrink-0 ${
                        darkMode ? avatar.dark : avatar.light
                      }`}
                    />

                    <span className="truncate font-medium">{student.name}</span>
                  </div>
                </div>

                {/* Enrollment */}

                <div className={`${rowClass} whitespace-nowrap`}>
                  {student.enrollmentNo}
                </div>

                {/* Department */}

                <div className={rowClass}>
                  <span className="truncate">{student.department}</span>
                </div>

                {/* CGPA */}

                <div className={rowClass}>{student.cgpa}</div>

                {/* Status */}

                <div className={`${rowClass} justify-center`}>
                  <StatusBadge status={student.status} />
                </div>

                {/* Company */}

                <div className={`${rowClass} justify-center`}>
                  <span className="truncate">{student.company}</span>
                </div>

                {/* Actions */}

                <div className={`${rowClass} justify-center`}>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewStudent(student)}
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
                      <Eye size={17} strokeWidth={2} />
                    </button>

                    <button
                      onClick={() => onNominate(student)}
                      title="Nominate Student"
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                        darkMode
                          ? "bg-blue-600 text-white hover:bg-blue-500"
                          : "bg-blue-500 text-white hover:bg-blue-700"
                      }`}
                    >
                      <UserPlus size={17} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={student.id}
                className={`${compactGrid} transition-colors ${
                  darkMode ? "hover:bg-slate-800/70" : "hover:bg-slate-50"
                }`}
              >
                {/* Student */}

                <div className={rowClass}>
                  <div className="flex min-w-0 items-center gap-3">
                    <CircleUserRound
                      size={24}
                      strokeWidth={2}
                      className={`shrink-0 ${
                        darkMode ? avatar.dark : avatar.light
                      }`}
                    />

                    <span className="truncate font-medium">{student.name}</span>
                  </div>
                </div>

                {/* Company */}

                <div className={`${rowClass} justify-center`}>
                  <span className="truncate">{student.company}</span>
                </div>

                {/* Actions */}

                <div className={`${rowClass} justify-center`}>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewStudent(student)}
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
                      <Eye size={17} strokeWidth={2} />
                    </button>

                    <button
                      onClick={() => onNominate(student)}
                      title="Nominate Student"
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                        darkMode
                          ? "bg-blue-600 text-white hover:bg-blue-500"
                          : "bg-blue-500 text-white hover:bg-blue-700"
                      }`}
                    >
                      <UserPlus size={17} strokeWidth={2} />
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
