import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  CalendarDays,
  GraduationCap,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";

import JobStatusBadge from "./JobStatusBadge";

const JobPostingCard = ({
  job,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="border rounded-xl p-6 hover:shadow-lg transition-all">

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-2">

            <BriefcaseBusiness
              className="text-blue-600"
              size={22}
            />

            <h3 className="text-xl font-semibold">
              {job.role}
            </h3>

          </div>

          <div className="mt-4 space-y-2 text-slate-600">

            <div className="flex items-center gap-2">

              <Building2 size={18} />

              {job.company}

            </div>

            {job.location && (
              <div className="flex items-center gap-2">

                <MapPin size={18} className="text-red-500" />

                {job.location}

              </div>
            )}

            <div className="flex items-center gap-2">

              <GraduationCap size={18} />

              CGPA : {job.cgpa}

            </div>

            <div className="flex items-center gap-2">

              <CalendarDays size={18} />

              {job.deadline}

            </div>

          </div>

        </div>

        <JobStatusBadge status={job.status} />

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => onEdit(job)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Pencil size={18} />
          Edit
        </button>

        <button
          onClick={() => onDelete(job.id)}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          <Trash2 size={18} />
          Delete
        </button>

        <button
          onClick={() => onToggleStatus(job.id)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <RefreshCw size={18} />
          Toggle Status
        </button>

      </div>

    </div>
  );
};

export default JobPostingCard;