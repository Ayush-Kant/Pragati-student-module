import { JOB_STATUS } from "../../constants/companyJobPostingConstants";

const JobStatusFilter = ({
  value = "",
  onChange,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    >
      <option value="">Status</option>

      {JOB_STATUS.map((status) => (
        <option
          key={status}
          value={status}
        >
          {status}
        </option>
      ))}
    </select>
  );
};

export default JobStatusFilter;