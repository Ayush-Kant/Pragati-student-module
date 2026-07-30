import { useOutletContext } from "react-router-dom";

const CategoryFilter = ({
  value,
  onChange,
  categories = [],
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
      <option value="">All Categories</option>

      {categories.map((category) => (
        <option
          key={category}
          value={category}
        >
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;