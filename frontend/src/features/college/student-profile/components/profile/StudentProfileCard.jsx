import React from "react";
import { GraduationCap } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export const StudentProfileCard = ({ student, darkMode }) => {
  const safeStudent = student || {};
  const initials = safeStudent.name
    ? safeStudent.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "S";

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-6 items-center md:items-start justify-between ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff6d34] to-[#00bea3] flex items-center justify-center text-white text-2xl font-black shadow-md">
          {initials}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{safeStudent.name || "Unknown Student"}</h2>
            {safeStudent.placementStatus && (
              <StatusBadge status={safeStudent.placementStatus} type="placement" />
            )}
          </div>
          <p className={`text-sm font-semibold flex items-center justify-center sm:justify-start gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <GraduationCap className="w-4 h-4 text-[#00bea3]" />
            {safeStudent.course || "N/A"} • {safeStudent.department || "N/A"}
          </p>
          <div className="text-xs text-gray-400 space-y-0.5 mt-2">
            <p>Enrollment No: <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{safeStudent.enrollmentNo || "N/A"}</span></p>
            <p>Batch: <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{safeStudent.batch || "—"}</span></p>
          </div>
        </div>
      </div>

      {/* Metrics summary */}
      <div className="flex gap-6 mt-2 md:mt-0">
        <div className={`text-center rounded-xl p-3 border min-w-24 ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-orange-50/40 border-orange-100/60'}`}>
          <span className={`block text-2xl font-extrabold ${darkMode ? 'text-[#ff6d34]' : 'text-[#ff6d34]'}`}>{safeStudent.cgpa || "0.00"}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-[#ff6d34]' : 'text-[#ff6d34]'}`}>Overall CGPA</span>
        </div>
        <div className={`text-center rounded-xl p-3 border min-w-24 ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-teal-50/40 border-teal-100/60'}`}>
          <span className={`block text-2xl font-extrabold ${darkMode ? 'text-[#00bea3]' : 'text-[#00bea3]'}`}>{safeStudent.attendance || "0%"}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-[#00bea3]' : 'text-[#00bea3]'}`}>Attendance</span>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;
