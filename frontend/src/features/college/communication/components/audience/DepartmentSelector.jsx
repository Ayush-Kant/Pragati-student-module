import { useOutletContext } from "react-router-dom";

const DepartmentSelector = ({
  value,
  onChange,
  departments = [],
}) => {
  const { darkMode } = useOutletContext();

  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full rounded-2xl border px-4 py-3 ${
        darkMode
          ? "border-slate-700 bg-[#151D30] text-white"
          : "border-slate-300 bg-white text-slate-800"
      }`}
    >
      <option value="">Select Department</option>

      {departments.map((department) => (
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

export default DepartmentSelector;