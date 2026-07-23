import React from "react";
import { Users, AlertTriangle } from "lucide-react";

export const AttendanceCard = ({ attendancePercent = 0, darkMode }) => {
  const percentNum = typeof attendancePercent === "string" 
    ? parseFloat(attendancePercent.replace("%", "")) 
    : attendancePercent;

  const clampedPercent = Math.max(0, Math.min(100, isNaN(percentNum) ? 0 : percentNum));

  let trackColor = darkMode ? "bg-[#ff6d34]" : "bg-indigo-600";
  let statusText = "Excellent";
  let statusDesc = "Maintained excellent class presence.";
  let statusBadge = darkMode ? "bg-[#ff6d34]/10 text-[#ff6d34] border-[#ff6d34]/30" : "bg-indigo-50 text-indigo-700 border-indigo-100/80";

  if (percentNum < 75) {
    trackColor = "bg-rose-500";
    statusText = "Shortage";
    statusDesc = "Below the required 75% limit.";
    statusBadge = darkMode ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-rose-50 text-rose-700 border-rose-100/80";
  } else if (percentNum < 85) {
    trackColor = darkMode ? "bg-amber-500" : "bg-amber-500";
    statusText = "Average";
    statusDesc = "Nearing mandatory attendance thresholds.";
    statusBadge = darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-700 border-amber-100/80";
  } else if (percentNum >= 90) {
    trackColor = darkMode ? "bg-[#00bea3]" : "bg-emerald-600";
    statusText = "Outstanding";
    statusDesc = "Consistently high class involvement.";
    statusBadge = darkMode ? "bg-[#00bea3]/10 text-[#00bea3] border-[#00bea3]/30" : "bg-emerald-50 text-emerald-700 border-emerald-100/80";
  }

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className={`flex items-center gap-2 ${darkMode ? 'text-[#ff6d34]' : 'text-indigo-600'}`}>
            <Users className={`w-5 h-5 ${darkMode ? 'text-[#ff6d34]' : 'text-indigo-500'}`} />
            <span className="text-xs font-bold uppercase tracking-wider">Class Presence</span>
          </div>
          <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Attendance</h3>
          <p className="text-xs text-gray-400 leading-normal">{statusDesc}</p>
        </div>

        <div className="text-right flex-shrink-0">
          <span className={`block text-3xl font-black leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {percentNum}%
          </span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusBadge} uppercase tracking-wide mt-1.5`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`}>
          <div
            style={{ width: `${clampedPercent}%` }}
            className={`h-full rounded-full transition-all duration-1000 shadow-sm ${trackColor}`}
          />
        </div>
        {percentNum < 75 && (
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-bold text-rose-600">
            <AlertTriangle className="w-3.5 h-3.5" />
            Warning: Minimum 75% attendance required for examinations.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCard;
