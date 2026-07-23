import { COMPANY_OPTIONS } from "../../constants/analyticsConstants";

export const CompanyFilter = ({ darkMode, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D] text-white focus:border-blue-500" : "bg-white border-gray-200 text-[#2D3436] focus:border-blue-500"
    }`}
  >
    {COMPANY_OPTIONS.map((c) => (
      <option key={c} value={c}>{c === "All" ? "All Companies" : c}</option>
    ))}
  </select>
);
