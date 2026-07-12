import React from "react";
import { BATCHES } from "../../constants/reportsConstants";

export const BatchFilter = ({ value, onChange }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch Year</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10 transition outline-none cursor-pointer"
      >
        <option value="All">All Batches</option>
        {BATCHES.map((batch) => (
          <option key={batch} value={batch}>
            Batch of {batch}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BatchFilter;
