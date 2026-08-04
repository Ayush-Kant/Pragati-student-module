import React from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

export const SemesterPerformance = ({ academics = [], selectedSemester, onSelectSemester, darkMode }) => {
  const toggleSemester = (semNum) => {
    if (selectedSemester === semNum) {
      onSelectSemester(null);
    } else {
      onSelectSemester(semNum);
    }
  };

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Semester breakdown</h3>
          <p className="text-xs text-gray-400">Detailed SGPA, attendance, and subject marks</p>
        </div>
      </div>

      <div className="space-y-3">
        {academics.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">No semester details recorded</div>
        ) : (
          academics.map((sem) => {
            const isExpanded = selectedSemester === sem.semester;
            return (
              <div
                key={sem.semester}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-100'}`}
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleSemester(sem.semester)}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left cursor-pointer ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#3D3D3D]' : 'bg-slate-50/50 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ff6d34]/10 text-[#ff6d34] text-xs font-bold">
                      S{sem.semester}
                    </span>
                    <div>
                      <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Semester {sem.semester}</span>
                      <span className="block text-[10px] text-gray-400">Attendance: {sem.attendance}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-medium">SGPA</span>
                      <span className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{sem.sgpa.toFixed(2)}</span>
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
                  <div className={`p-4 border-t animate-in fade-in slide-in-from-top-1 duration-200 ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100/60'}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-100'}`}>
                            <th className="pb-2">Subject Name</th>
                            <th className="pb-2 text-center">Grade</th>
                            <th className="pb-2 text-right">Credits</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y text-xs ${darkMode ? 'divide-[#3D3D3D] text-gray-400' : 'divide-gray-50/50 text-gray-600'}`}>
                          {sem.subjects && sem.subjects.length > 0 ? (
                            sem.subjects.map((sub, index) => (
                              <tr key={index} className={darkMode ? 'hover:bg-[#1A1A1A]' : 'hover:bg-slate-50/30'}>
                                <td className="py-2.5 font-medium flex items-center gap-2">
                                  <BookOpen className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`} />
                                  {sub.name}
                                </td>
                                <td className="py-2.5 text-center">
                                  <span className="inline-block px-2 py-0.5 rounded-md font-bold bg-[#ff6d34]/10 text-[#ff6d34] border border-[#ff6d34]/20 text-[10px]">
                                    {sub.grade}
                                  </span>
                                </td>
                                <td className={`py-2.5 text-right font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sub.credits}</td>
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
