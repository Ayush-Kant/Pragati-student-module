import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  CalendarDays,
  GraduationCap,
  Pencil,
  Trash2,
  RefreshCw,
  Layers,
  Users,
  IndianRupee,
  FileText,
  ClipboardList,
} from "lucide-react";

import JobStatusBadge from "./JobStatusBadge";

const JobPostingCard = ({
  job,
  onEdit,
  onDelete,
  onToggleStatus,
  darkMode,
}) => {
  return (
    <div className={`border rounded-xl p-6 hover:shadow-lg transition-all ${darkMode ? 'border-[#3D3D3D] bg-[#2D2D2D]' : 'bg-white'}`}>

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-2">

            <BriefcaseBusiness
              className={darkMode ? 'text-[#ff6d34]' : 'text-blue-600'}
              size={22}
            />

            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {job.role}
            </h3>

          </div>

          <div className={`mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>

            <div className="flex items-center gap-2">
              <Building2 size={18} className={darkMode ? 'text-gray-500' : 'text-slate-400'} />
              <span>{job.company}</span>
            </div>

            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-red-500" />
                <span>{job.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Layers size={18} className={darkMode ? 'text-gray-500' : 'text-slate-400'} />
              <span>Department: {job.department || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={18} className={darkMode ? 'text-gray-500' : 'text-slate-400'} />
              <span>Batch: {job.batch || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap size={18} className={darkMode ? 'text-gray-500' : 'text-slate-400'} />
              <span>CGPA: {job.cgpa}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={18} className={darkMode ? 'text-gray-500' : 'text-slate-400'} />
              <span>Deadline: {job.deadline}</span>
            </div>

            {job.package && (
              <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                <IndianRupee size={18} className={darkMode ? 'text-[#00bea3]' : 'text-green-600'} />
                <span className={`font-semibold ${darkMode ? 'text-[#00bea3]' : 'text-green-600'}`}>Package: {job.package}</span>
              </div>
            )}

          </div>

        </div>

        <JobStatusBadge status={job.status} darkMode={darkMode} />

      </div>

      {/* Detailed Info Section */}
      {(job.jobDescription || job.hiringProcess) && (
        <div className={`mt-6 pt-4 border-t space-y-4 ${darkMode ? 'border-[#3D3D3D]' : 'border-slate-100'}`}>
          {job.jobDescription && (
            <div>
              <h4 className={`text-sm font-semibold flex items-center gap-1.5 mb-1 ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                <FileText size={16} className={darkMode ? 'text-gray-400' : 'text-slate-500'} />
                Job Description
              </h4>
              <p className={`text-sm leading-relaxed whitespace-pre-line p-3 rounded-lg border ${darkMode ? 'text-gray-300 bg-[#1A1A1A] border-[#3D3D3D]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                {job.jobDescription}
              </p>
            </div>
          )}

          {job.hiringProcess && (
            <div>
              <h4 className={`text-sm font-semibold flex items-center gap-1.5 mb-1 ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                <ClipboardList size={16} className={darkMode ? 'text-gray-400' : 'text-slate-500'} />
                Hiring Process
              </h4>
              <p className={`text-sm leading-relaxed whitespace-pre-line p-3 rounded-lg border ${darkMode ? 'text-gray-300 bg-[#1A1A1A] border-[#3D3D3D]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                {job.hiringProcess}
              </p>
            </div>
          )}
        </div>
      )}

      <div className={`flex gap-3 mt-6 border-t pt-4 ${darkMode ? 'border-[#3D3D3D]' : 'border-slate-100'}`}>

        <button
          onClick={() => onEdit(job)}
          className="flex items-center gap-2 bg-[#ff6d34] text-white px-4 py-2 rounded-lg hover:bg-[#ff6d34]/90 transition"
        >
          <Pencil size={18} />
          Edit
        </button>

        <button
          onClick={() => onDelete(job.id)}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <Trash2 size={18} />
          Delete
        </button>

        <button
          onClick={() => onToggleStatus(job.id)}
          className="flex items-center gap-2 bg-[#00bea3] text-white px-4 py-2 rounded-lg hover:bg-[#00bea3]/90 transition ml-auto"
        >
          <RefreshCw size={18} />
          Toggle Status
        </button>

      </div>

    </div>
  );
};

export default JobPostingCard;