import { COMPANIES } from "../../constants/reportsConstants";

export const CompanyFilter = ({ value, onChange }) => {
  const options = ["All", ...COMPANIES.filter(c => c !== "All Companies")];

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10 transition outline-none cursor-pointer"
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
