import JobPostingCard from "./JobPostingCard";

const JobPostingTable = ({
  jobs,
  onEdit,
  onDelete,
  onToggleStatus,
  darkMode,
}) => {
  return (
    <div className={`rounded-xl shadow-md ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>

      <div className={`border-b px-6 py-4 ${darkMode ? 'border-[#3D3D3D]' : ''}`}>

        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-700'}`}>
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
            darkMode={darkMode}
          />
        ))}

      </div>

    </div>
  );
};

export default JobPostingTable;