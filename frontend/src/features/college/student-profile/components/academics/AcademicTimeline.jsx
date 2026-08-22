import React, { useMemo } from "react";
import { Trophy, Award, CheckCircle } from "lucide-react";

export const AcademicTimeline = ({ academics = [], darkMode }) => {
  // Sort semesters descending
  const sortedTerms = useMemo(() => {
    return [...academics].sort((a, b) => b.semester - a.semester);
  }, [academics]);

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="mb-6">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Academic History</h3>
        <p className="text-xs text-gray-400">Timeline of term milestones and awards</p>
      </div>

      <div className={`relative pl-6 border-l-2 space-y-6 ml-3.5 ${darkMode ? 'border-[#3D3D3D]' : 'border-slate-100'}`}>
        {sortedTerms.length === 0 ? (
          <div className="text-xs text-gray-400 pl-2">No historical terms logged.</div>
        ) : (
          sortedTerms.map((sem, index) => {
            const sgpa = parseFloat(sem.sgpa);
            let Icon = CheckCircle;
            let iconColor = darkMode ? "bg-[#ff6d34]/10 border-[#ff6d34]/30 text-[#ff6d34]" : "bg-indigo-50 border-indigo-100 text-indigo-500";
            let milestone = "Completed successfully";

            if (sgpa >= 9.0) {
              Icon = Trophy;
              iconColor = darkMode ? "bg-[#00bea3]/10 border-[#00bea3]/30 text-[#00bea3]" : "bg-amber-50 border-amber-200 text-amber-500 shadow-sm shadow-amber-50";
              milestone = "Dean's List Award";
            } else if (sgpa >= 8.5) {
              Icon = Award;
              iconColor = darkMode ? "bg-[#ff6d34]/10 border-[#ff6d34]/30 text-[#ff6d34]" : "bg-emerald-50 border-emerald-200 text-emerald-500 shadow-sm shadow-emerald-50";
              milestone = "Academic Distinction Honors";
            }

            return (
              <div key={sem.semester} className="relative">
                {/* Connector Dot Icon */}
                <div className={`absolute -left-10 top-0.5 w-7.5 h-7.5 rounded-full border flex items-center justify-center ${iconColor} z-10`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Semester {sem.semester}</span>
                    <span className="text-[10px] font-bold text-gray-400">SGPA: {sgpa.toFixed(2)}</span>
                  </div>
                  <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{milestone}</p>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    Attended {sem.attendance} of lectures and labs.
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AcademicTimeline;
