import { REPORT_TYPES } from "../../constants/analyticsConstants";

export const ReportFilter = ({ darkMode, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D] text-white focus:border-blue-500" : "bg-white border-gray-200 text-[#2D3436] focus:border-blue-500"
    }`}
  >
    {REPORT_TYPES.map((r) => (
      <option key={r.value} value={r.value}>{r.label}</option>
    ))}
  </select>
);
