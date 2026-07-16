import React, { useState } from "react";
import CGPACard from "./CGPACard";
import AttendanceCard from "./AttendanceCard";
import SemesterPerformance from "./SemesterPerformance";
import AcademicTimeline from "./AcademicTimeline";
import CGPATrendChart from "../charts/CGPATrendChart";
import PerformanceChart from "../charts/PerformanceChart";

export const AcademicPerformance = ({ academics = [], student = {} }) => {
  const [selectedSemester, setSelectedSemester] = useState(null);

  const semestersCompleted = academics.length;
  
  // Calculate CGPA safely
  const cgpa = academics.length > 0
    ? (academics.reduce((sum, sem) => sum + (parseFloat(sem.sgpa) || 0), 0) / semestersCompleted).toFixed(2)
    : "0.00";

  // Calculate Average Attendance safely (falling back to student.attendance if semester-specific attendance is missing)
  const avgAttendance = academics.length > 0
    ? Math.round(
        academics.reduce((sum, sem) => {
          const attendanceStr = sem.attendance || student.attendance || "0%";
          const attendanceVal = parseFloat(String(attendanceStr).replace("%", ""));
          return sum + (isNaN(attendanceVal) ? 0 : attendanceVal);
        }, 0) / semestersCompleted
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CGPACard cgpa={parseFloat(cgpa)} semestersCompleted={semestersCompleted} />
        <AttendanceCard attendancePercent={avgAttendance} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={academics} />
        <CGPATrendChart data={academics} />
      </div>

      {/* Semester details & Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SemesterPerformance
            academics={academics}
            selectedSemester={selectedSemester}
            onSelectSemester={setSelectedSemester}
          />
        </div>
        <div className="lg:col-span-1">
          <AcademicTimeline academics={academics} />
        </div>
      </div>
    </div>
  );
};

export default AcademicPerformance;
