import { useOutletContext } from "react-router-dom";

const StatusFilter = ({
  value,
  onChange,
  statuses = [],
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
      <option value="">All Status</option>

      {statuses.map((status) => (
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

export default StatusFilter;