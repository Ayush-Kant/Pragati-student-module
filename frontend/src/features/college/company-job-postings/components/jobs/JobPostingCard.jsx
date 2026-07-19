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
}) => {
  return (
    <div className="border rounded-xl p-6 hover:shadow-lg transition-all bg-white">

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-2">

            <BriefcaseBusiness
              className="text-blue-600"
              size={22}
            />

            <h3 className="text-xl font-semibold text-slate-800">
              {job.role}
            </h3>

          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-slate-600">

            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-slate-400" />
              <span>{job.company}</span>
            </div>

            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-red-500" />
                <span>{job.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Layers size={18} className="text-slate-400" />
              <span>Department: {job.department || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={18} className="text-slate-400" />
              <span>Batch: {job.batch || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-slate-400" />
              <span>CGPA: {job.cgpa}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-slate-400" />
              <span>Deadline: {job.deadline}</span>
            </div>

            {job.package && (
              <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                <IndianRupee size={18} className="text-green-600" />
                <span className="font-semibold text-green-600">Package: {job.package}</span>
              </div>
            )}

          </div>

        </div>

        <JobStatusBadge status={job.status} />

      </div>

      {/* Detailed Info Section */}
      {(job.jobDescription || job.hiringProcess) && (
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
          {job.jobDescription && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <FileText size={16} className="text-slate-500" />
                Job Description
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100">
                {job.jobDescription}
              </p>
            </div>
          )}

          {job.hiringProcess && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <ClipboardList size={16} className="text-slate-500" />
                Hiring Process
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100">
                {job.hiringProcess}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-6 border-t border-slate-100 pt-4">

        <button
          onClick={() => onEdit(job)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition ml-auto"
        >
          <RefreshCw size={18} />
          Toggle Status
        </button>

      </div>

    </div>
  );
};

export default JobPostingCard;