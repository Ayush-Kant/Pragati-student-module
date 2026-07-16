import React from "react";
import { Calendar, Building } from "lucide-react";

export const InternshipCard = ({ internships = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Internship Experience</h3>
        <p className="text-xs text-gray-400">Professional training and industrial work history</p>
      </div>

      <div className="space-y-4">
        {internships.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">No internship history recorded.</div>
        ) : (
          internships.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-xl border border-gray-100 bg-slate-50/10 hover:bg-slate-50/30 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-800">{job.role}</h4>
                    <span className="text-xs font-semibold text-gray-500">{job.company}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50/50 border border-indigo-100/30 rounded-xl text-[10px] font-bold text-indigo-600 sm:self-start flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  {job.duration}
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-medium pl-0 sm:pl-13">
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
