import { REPORT_TYPES } from "../../constants/analyticsConstants";

const selectCls = (darkMode) =>
  `px-3 py-1.5 text-xs rounded-lg border outline-none transition-colors ${
    darkMode
      ? "bg-[#3D3D3D] border-[#4D4D4D] text-white focus:border-[#00bea3]"
      : "bg-gray-50 border-gray-200 text-[#2D3436] focus:border-[#00bea3]"
  }`;

export const ReportFilter = ({ darkMode, value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls(darkMode)}>
    {REPORT_TYPES.map((r) => (
      <option key={r.value} value={r.value}>{r.label}</option>
    ))}
  </select>
);
