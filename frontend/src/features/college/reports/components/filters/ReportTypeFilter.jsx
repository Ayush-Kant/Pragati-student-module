import { REPORT_TYPES } from "../../constants/reportsConstants";

export const ReportTypeFilter = ({ activeType, onChange, darkMode }) => {
  const options = ["All", ...REPORT_TYPES];

  return (
    <div className="flex flex-col space-y-2">
      <label className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Report Type</label>
      <div className={`flex flex-wrap gap-2`}>
        {options.map((type) => {
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-150 active:scale-97 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-primary border-2px text-black shadow-md shadow-orange-500"
                  : `${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D] text-gray-400 hover:bg-[#1A1A1A] hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportTypeFilter;
