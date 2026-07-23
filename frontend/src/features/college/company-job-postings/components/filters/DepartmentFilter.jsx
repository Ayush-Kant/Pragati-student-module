import { DEPARTMENTS } from "../../constants/companyJobPostingConstants";

const DepartmentFilter = ({
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
      <option value="">Department</option>

      {DEPARTMENTS.map((department) => (
        <option
          key={department}
          value={department}
        >
          {department}
        </option>
      ))}
    </select>
  );
};

export default DepartmentFilter;