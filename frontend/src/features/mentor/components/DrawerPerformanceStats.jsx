import React from "react";
import { FileText, FolderGit, Award, CalendarDays } from "lucide-react";

export default function DrawerPerformanceStats({
  performance = { assignments: "0/0", projects: 0, certificates: 0 },
  attendance = "0%"
}) {
  // Parse attendance percentage
  const attendanceNum = parseInt(attendance) || 0;

  // Circular progress ring setup
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendanceNum / 100) * circumference;

  const getAttendanceColor = (pct) => {
    if (pct >= 85) return "text-emerald-500 stroke-emerald-500";
    if (pct >= 75) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const ringColor = getAttendanceColor(attendanceNum);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="text-sm font-bold text-slate-800 mb-4">Performance & Metrics</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left column: 3-column subgrid for stats */}
        <div className="grid grid-cols-3 gap-2">
          {/* Assignments */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-center">
            <FileText className="h-4.5 w-4.5 text-[#004ac6] mb-1.5" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Assignments
            </span>
            <span className="text-sm font-extrabold text-slate-800 mt-0.5">
              {performance.assignments}
            </span>
          </div>

          {/* Projects */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-center">
            <FolderGit className="h-4.5 w-4.5 text-[#004ac6] mb-1.5" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Projects
            </span>
            <span className="text-sm font-extrabold text-slate-800 mt-0.5">
              {performance.projects}
            </span>
          </div>

          {/* Certificates */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-center">
            <Award className="h-4.5 w-4.5 text-[#004ac6] mb-1.5" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Certificates
            </span>
            <span className="text-sm font-extrabold text-slate-800 mt-0.5">
              {performance.certificates}
            </span>
          </div>
        </div>

        {/* Right column: Circular attendance tracker */}
        <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="relative flex items-center justify-center h-16 w-16 shrink-0">
            {/* SVG Ring */}
            <svg className="h-16 w-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-slate-100 fill-transparent"
                strokeWidth="5"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className={`fill-transparent transition-all duration-500 ${ringColor.split(" ")[1]}`}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs font-black text-slate-800">{attendanceNum}%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
              Attendance
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">
              {attendanceNum >= 85
                ? "Excellent engagement levels"
                : attendanceNum >= 75
                ? "Meets minimum attendance criteria"
                : "At risk, immediate attention needed"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
