export const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10 transition outline-none"
        />
        <span className="absolute -top-2 left-3 px-1 text-[9px] font-bold text-slate-400 bg-white border border-slate-100 rounded">
          FROM
        </span>
      </div>

      <div className="relative w-full">
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10 transition outline-none"
        />
        <span className="absolute -top-2 left-3 px-1 text-[9px] font-bold text-slate-400 bg-white border border-slate-100 rounded">
          TO
        </span>
      </div>
    </div>
  );
};

export default DateRangeFilter;
