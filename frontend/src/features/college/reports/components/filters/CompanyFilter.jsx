import { COMPANIES } from "../../constants/reportsConstants";

export const CompanyFilter = ({ value, onChange, darkMode }) => {
  const options = ["All", ...COMPANIES.filter(c => c !== "All Companies")];

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Company</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 text-sm font-medium rounded-xl border transition outline-none cursor-pointer ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#1A1A1A] text-gray-300 border-[#3D3D3D] focus:border-[#ff6d34] focus:ring-4 focus:ring-[#ff6d34]/10' : 'bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10'}`}
      >
        {options.map((company) => (
          <option key={company} value={company}>
            {company === "All" ? "All Companies" : company}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanyFilter;
