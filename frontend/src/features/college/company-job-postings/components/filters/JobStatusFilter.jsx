import { JOB_STATUS } from "../../constants/companyJobPostingConstants";

const JobStatusFilter = ({
  value = "",
  onChange,
  darkMode,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#ff6d34] ${
        darkMode
          ? 'bg-[#1A1A1A] border-[#3D3D3D] text-white'
          : 'border border-slate-300 focus:border-blue-500 focus:ring-blue-200'
      }`}
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