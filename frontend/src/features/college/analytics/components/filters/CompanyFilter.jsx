import { COMPANY_OPTIONS } from "../../constants/analyticsConstants";

const selectCls = (darkMode) =>
  `px-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
    darkMode
      ? "bg-[#3D3D3D] border-[#4D4D4D] text-white focus:border-[#00bea3]"
      : "bg-gray-50 border-gray-200 text-[#2D3436] focus:border-[#00bea3]"
  }`;

export const CompanyFilter = ({ darkMode, value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls(darkMode)}>
    {COMPANY_OPTIONS.map((c) => (
      <option key={c} value={c}>{c === "All" ? "All Companies" : c}</option>
    ))}
  </select>
);
