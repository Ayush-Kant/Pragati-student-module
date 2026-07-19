import { DEPARTMENTS } from "../../constants/companyJobPostingConstants";

const DepartmentFilter = ({
  value = "",
  onChange,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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