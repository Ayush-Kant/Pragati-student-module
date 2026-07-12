import React, { useMemo } from "react";
import { TrendingUp, BarChart2, CheckCircle2 } from "lucide-react";

export const ReportStatistics = ({ reports }) => {
  // Compute report distributions
  const typeDistribution = useMemo(() => {
    const counts = {};
    reports.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    
    const total = reports.length || 1;
    return Object.entries(counts).map(([type, count]) => ({
      name: type,
      count,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [reports]);

  // Activity trend (grouped by date)
  const activityTrend = useMemo(() => {
    const dates = {};
    // Last 5 days of activity
    reports.forEach((r) => {
      dates[r.generatedOn] = (dates[r.generatedOn] || 0) + 1;
    });

    const sortedDates = Object.entries(dates)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-5);

    if (sortedDates.length === 0) {
      return [
        { label: "10/10", count: 2 },
        { label: "10/12", count: 4 },
        { label: "10/15", count: 8 },
        { label: "10/18", count: 12 },
        { label: "10/22", count: 18 }
      ];
    }

    return sortedDates.map(([date, count]) => {
      const parts = date.split("-");
      return {
        label: `${parts[2] || "01"}/${parts[1] || "10"}`,
        count
      };
    });
  }, [reports]);

  // Color mappings
  const getColorClass = (index) => {
    const colors = [
      { fill: "bg-primary border-primary text-primary", hex: "#ff6d34" },
      { fill: "bg-blue-500 border-blue-500 text-blue-500", hex: "#3b82f6" },
      { fill: "bg-purple-500 border-purple-500 text-purple-500", hex: "#a855f7" },
      { fill: "bg-emerald-500 border-emerald-500 text-emerald-500", hex: "#10b981" },
      { fill: "bg-amber-500 border-amber-500 text-amber-500", hex: "#f59e0b" },
      { fill: "bg-pink-500 border-pink-500 text-pink-500", hex: "#ec4899" }
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart 1: Doughnut / Progress Distribution */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm lg:col-span-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800 text-sm">Reports by Type</h4>
            <BarChart2 className="w-4 h-4 text-slate-400" />
          </div>
          
          {/* Progress bar lists */}
          <div className="space-y-3.5 mt-6">
            {typeDistribution.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold py-8 text-center">No category metrics compiled yet.</p>
            ) : (
              typeDistribution.map((item, index) => {
                const colors = getColorClass(index);
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${colors.fill.split(" ")[0]}`}></span>
                        <span>{item.name}</span>
                      </span>
                      <span className="text-slate-500">{item.count} ({item.percentage}%)</span>
                    </div>
                    {/* Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${item.percentage}%` }}
                        className={`h-full transition-all duration-500 ${colors.fill.split(" ")[0]}`}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="border-t border-slate-50 pt-4 mt-6 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
          <span>Target Types: {typeDistribution.length}</span>
          <span className="text-primary flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal</span>
          </span>
        </div>
      </div>

      {/* Chart 2: SVG Column bar chart (Generations trends) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800 text-sm font-sans">Report Compilation Trend</h4>
            <div className="flex items-center space-x-1 text-xs text-slate-400 font-semibold bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-slate-500">Live Trend</span>
            </div>
          </div>
          
          {/* Custom SVG bar chart */}
          <div className="relative h-44 w-full flex items-end justify-between px-3 pb-2 border-b border-l border-slate-100 mt-6 gap-2">
            {activityTrend.map((item, idx) => {
              const maxVal = Math.max(...activityTrend.map(d => d.count), 1);
              const pct = Math.round((item.count / maxVal) * 100);
              
              return (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  {/* Tooltip on Hover */}
                  <span className="absolute -translate-y-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow z-10">
                    {item.count} Reports
                  </span>

                  {/* SVG Bar Pillar */}
                  <div 
                    style={{ height: `${Math.max(12, pct * 1.1)}px` }}
                    className="w-12 bg-primary/20 group-hover:bg-primary border border-primary/10 rounded-t-xl transition-all duration-200"
                  ></div>

                  {/* Label */}
                  <span className="text-[10px] font-bold text-slate-400 mt-2 select-none">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-50 pt-4 mt-6 text-[11px] font-semibold text-slate-400 flex items-center justify-between leading-relaxed">
          <span>Metrics updated instantly as new operations occur.</span>
          <span className="text-slate-500 font-bold">X-Axis: Date (DD/MM)</span>
        </div>
      </div>
    </div>
  );
};

export default ReportStatistics;
