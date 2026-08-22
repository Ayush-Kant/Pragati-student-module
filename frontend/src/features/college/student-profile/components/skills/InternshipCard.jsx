import React from "react";
import { Calendar, Building } from "lucide-react";

export const InternshipCard = ({ internships = [], darkMode }) => {
  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="mb-4">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Internship Experience</h3>
        <p className="text-xs text-gray-400">Professional training and industrial work history</p>
      </div>

      <div className="space-y-4">
        {internships.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">No internship history recorded.</div>
        ) : (
          internships.map((job) => (
            <div
              key={job.id}
              className={`p-5 rounded-xl border transition-all duration-200 ${
                darkMode
                  ? 'border-[#3D3D3D] bg-[#1A1A1A] hover:bg-[#2D2D2D]'
                  : 'border-gray-100 bg-slate-50/10 hover:bg-slate-50/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                    darkMode
                      ? 'bg-[#1A1A1A] border-[#3D3D3D] text-[#ff6d34]'
                      : 'bg-blue-50 border-blue-100 text-blue-600'
                  }`}>
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{job.role}</h4>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{job.company}</span>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold sm:self-start flex-shrink-0 ${
                  darkMode
                    ? 'bg-[#1A1A1A] border border-[#3D3D3D] text-[#00bea3]'
                    : 'bg-indigo-50/50 border border-indigo-100/30 text-indigo-600'
                }`}>
                  <Calendar className="w-3.5 h-3.5" />
                  {job.duration}
                </div>
              </div>

              <p className={`text-xs leading-relaxed font-medium pl-0 sm:pl-13 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {job.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InternshipCard;
