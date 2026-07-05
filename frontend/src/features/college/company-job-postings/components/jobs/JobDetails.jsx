import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

import JobStatusBadge from "./JobStatusBadge";

const JobDetails = ({ job }) => {
  if (!job) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-8">

      <div className="flex justify-between">

        <div>

          <div className="flex items-center gap-2">

            <BriefcaseBusiness
              className="text-blue-600"
            />

            <h2 className="text-3xl font-bold">
              {job.role}
            </h2>

          </div>

        </div>

        <JobStatusBadge status={job.status} />

      </div>

      <div className="space-y-4 mt-8">

        <div className="flex items-center gap-2">

          <Building2 />

          {job.company}

        </div>

        <div className="flex items-center gap-2">

          <GraduationCap />

          CGPA : {job.cgpa}

        </div>

        <div className="flex items-center gap-2">

          <CalendarDays />

          {job.deadline}

        </div>

      </div>

    </div>
  );
};

export default JobDetails;