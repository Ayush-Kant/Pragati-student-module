import JobPostingCard from "./JobPostingCard";

const JobPostingTable = ({
  jobs,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md">

      <div className="border-b px-6 py-4">

        <h2 className="text-xl font-semibold text-slate-700">
          Job Postings
        </h2>

      </div>

      <div className="grid gap-5 p-6">

        {jobs.map((job) => (
          <JobPostingCard
            key={job.id}
            job={job}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))}

      </div>

    </div>
  );
};

export default JobPostingTable;