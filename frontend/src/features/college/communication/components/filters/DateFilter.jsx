import { useOutletContext } from "react-router-dom";

const DateFilter = ({
  value,
  onChange,
}) => {
  const { darkMode } = useOutletContext();

  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className={`w-full rounded-2xl border px-4 py-3 ${
        darkMode
          ? "border-slate-700 bg-[#151D30] text-white"
          : "border-slate-300 bg-white text-slate-800"
      }`}
    />
  );
};

export default DateFilter;