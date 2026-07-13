import React from "react";
import { GraduationCap } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export const StudentProfileCard = ({ student }) => {
  const safeStudent = student || {};
  const initials = safeStudent.name
    ? safeStudent.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "S";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-md border border-indigo-100">
          {initials}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{safeStudent.name || "Unknown Student"}</h2>
            {safeStudent.placementStatus && (
              <StatusBadge status={safeStudent.placementStatus} type="placement" />
            )}
          </div>
          <p className="text-sm font-semibold text-gray-500 flex items-center justify-center sm:justify-start gap-1">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            {safeStudent.course || "N/A"} • {safeStudent.department || "N/A"}
          </p>
          <div className="text-xs text-gray-400 space-y-0.5 mt-2">
            <p>Enrollment No: <span className="font-semibold text-gray-700">{safeStudent.enrollmentNo || "N/A"}</span></p>
            <p>Batch: <span className="font-semibold text-gray-700">{safeStudent.batch || "—"}</span></p>
          </div>
        </div>
      </div>

      {/* Metrics summary */}
      <div className="flex gap-6 mt-2 md:mt-0">
        <div className="text-center bg-indigo-50/40 rounded-xl p-3 border border-indigo-100/60 min-w-24">
          <span className="block text-2xl font-extrabold text-indigo-600">{safeStudent.cgpa || "0.00"}</span>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Overall CGPA</span>
        </div>
        <div className="text-center bg-emerald-50/40 rounded-xl p-3 border border-emerald-100/60 min-w-24">
          <span className="block text-2xl font-extrabold text-emerald-600">{safeStudent.attendance || "0%"}</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Attendance</span>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;
