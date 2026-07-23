export const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange, error, darkMode }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className={`w-full px-3 py-2 text-sm font-medium rounded-xl border transition outline-none ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#1A1A1A] text-gray-300 border-[#3D3D3D] focus:border-[#ff6d34] focus:ring-4 focus:ring-[#ff6d34]/10' : 'bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10'}`}
        />
        <span className={`absolute -top-2 left-3 px-1 text-[9px] font-bold rounded ${darkMode ? 'text-gray-500 bg-[#2D2D2D] border border-[#3D3D3D]' : 'text-slate-400 bg-white border border-slate-100'}`}>
          FROM
        </span>
      </div>

      <div className="relative w-full">
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className={`w-full px-3 py-2 text-sm font-medium rounded-xl border transition outline-none ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#1A1A1A] text-gray-300 border-[#3D3D3D] focus:border-[#ff6d34] focus:ring-4 focus:ring-[#ff6d34]/10' : 'bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10'}`}
        />
        <span className={`absolute -top-2 left-3 px-1 text-[9px] font-bold rounded ${darkMode ? 'text-gray-500 bg-[#2D2D2D] border border-[#3D3D3D]' : 'text-slate-400 bg-white border border-slate-100'}`}>
          TO
        </span>
      </div>
    </div>
  );
};

export default DateRangeFilter;
