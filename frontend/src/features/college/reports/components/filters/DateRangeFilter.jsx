import React from "react";

export const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange, error }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Range</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative w-full">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10 transition outline-none cursor-pointer"
          />
          <span className="absolute -top-1.5 left-2 px-1 text-[9px] font-bold text-slate-400 bg-white border border-slate-100 rounded">
            FROM
          </span>
        </div>
        <div className="relative w-full">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10 transition outline-none cursor-pointer"
          />
          <span className="absolute -top-1.5 left-2 px-1 text-[9px] font-bold text-slate-400 bg-white border border-slate-100 rounded">
            TO
          </span>
        </div>
      </div>
      {error && (
        <span className="text-[11px] font-semibold text-red-500 mt-0.5">{error}</span>
      )}
    </div>
  );
};

export default DateRangeFilter;
