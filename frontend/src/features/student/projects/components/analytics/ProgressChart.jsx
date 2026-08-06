import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const ProgressChart = ({ progressOverTime = [], taskDistribution = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Planned vs Actual Progress Area Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-surface-900 dark:text-white">Project Progress Velocity</h3>
            <p className="text-xs text-surface-500">Planned vs Actual Completion %</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="planned" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorPlanned)" name="Planned %" />
              <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Distribution Donut Chart */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-surface-900 dark:text-white">Task Distribution</h3>
          <p className="text-xs text-surface-500">Breakdown by task state</p>
        </div>

        <div className="h-56 w-full flex items-center justify-center my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskDistribution}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
