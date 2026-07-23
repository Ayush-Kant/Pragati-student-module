import { Calendar } from "lucide-react";
import { subtleText } from "../../utils/analyticsHelpers";

const inputCls = (darkMode) =>
  `px-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
    darkMode
      ? "bg-[#3D3D3D] border-[#4D4D4D] text-white focus:border-[#00bea3]"
      : "bg-gray-50 border-gray-200 text-[#2D3436] focus:border-[#00bea3]"
  }`;

export const DateFilter = ({ darkMode, value, onChange }) => (
  <div className="flex items-center gap-2">
    <Calendar className={`w-4 h-4 ${subtleText(darkMode)}`} />
    <input type="date" value={value?.start || ""} onChange={(e) => onChange({ ...value, start: e.target.value })} className={inputCls(darkMode)} />
    <span className={`text-xs ${subtleText(darkMode)}`}>to</span>
    <input type="date" value={value?.end || ""} onChange={(e) => onChange({ ...value, end: e.target.value })} className={inputCls(darkMode)} />
  </div>
);
