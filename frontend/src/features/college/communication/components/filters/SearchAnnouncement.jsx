import { Search } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const SearchAnnouncement = ({ value, onChange }) => {
  const { darkMode } = useOutletContext();

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      />

      <input
        type="text"
        placeholder="Search announcements..."
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border py-3 pl-11 pr-4 transition-all outline-none ${
          darkMode
            ? "border-slate-700 bg-[#151D30] text-white placeholder:text-slate-500"
            : "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400"
        }`}
      />
    </div>
  );
};

export default SearchAnnouncement;