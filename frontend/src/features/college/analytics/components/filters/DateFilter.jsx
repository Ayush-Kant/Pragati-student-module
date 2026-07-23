import { Calendar } from "lucide-react";

export const DateFilter = ({ darkMode, value, onChange }) => (
  <div className="flex items-center gap-2">
    <Calendar className={`w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
    <input
      type="date"
      value={value?.start || ""}
      onChange={(e) => onChange({ ...value, start: e.target.value })}
      className={`px-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
        darkMode ? "bg-[#2D2D2D] border-[#3D3D3D] text-white focus:border-blue-500" : "bg-white border-gray-200 text-[#2D3436] focus:border-blue-500"
      }`}
    />
    <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>to</span>
    <input
      type="date"
      value={value?.end || ""}
      onChange={(e) => onChange({ ...value, end: e.target.value })}
      className={`px-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
        darkMode ? "bg-[#2D2D2D] border-[#3D3D3D] text-white focus:border-blue-500" : "bg-white border-gray-200 text-[#2D3436] focus:border-blue-500"
      }`}
    />
  </div>
);
