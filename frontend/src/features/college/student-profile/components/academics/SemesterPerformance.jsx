import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Layers } from "lucide-react";

export const SemesterPerformance = ({ academics = [] }) => {
  const [expandedSemester, setExpandedSemester] = useState(null);

  const toggleSemester = (semNum) => {
    if (expandedSemester === semNum) {
      setExpandedSemester(null);
    } else {
      setExpandedSemester(semNum);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Semester breakdown</h3>
          <p className="text-xs text-gray-400">Detailed SGPA, attendance, and subject marks</p>
        </div>
      </div>

      <div className="space-y-3">
        {academics.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">No semester details recorded</div>
        ) : (
          academics.map((sem) => {
            const isExpanded = expandedSemester === sem.semester;
            return (
              <div
                key={sem.semester}
                className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-200"
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleSemester(sem.semester)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">
                      S{sem.semester}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-gray-800">Semester {sem.semester}</span>
                      <span className="block text-[10px] text-gray-400">Attendance: {sem.attendance}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-medium">SGPA</span>
                      <span className="text-sm font-extrabold text-gray-800">{sem.sgpa.toFixed(2)}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4.5 h-4.5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Subjects Table */}
                {isExpanded && (
                  <div className="p-4 bg-white border-t border-gray-100/60 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <th className="pb-2">Subject Name</th>
                            <th className="pb-2 text-center">Grade</th>
                            <th className="pb-2 text-right">Credits</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50 text-xs text-gray-600">
                          {sem.subjects && sem.subjects.length > 0 ? (
                            sem.subjects.map((sub, index) => (
                              <tr key={index} className="hover:bg-slate-50/30">
                                <td className="py-2.5 font-medium flex items-center gap-2">
                                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                  {sub.name}
                                </td>
                                <td className="py-2.5 text-center">
                                  <span className="inline-block px-2 py-0.5 rounded-md font-bold bg-indigo-50/50 text-indigo-600 border border-indigo-100/30 text-[10px]">
                                    {sub.grade}
                                  </span>
                                </td>
                                <td className="py-2.5 text-right font-semibold text-gray-700">{sub.credits}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="py-3 text-center text-gray-400">
                                No subject records loaded for this term.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SemesterPerformance;
