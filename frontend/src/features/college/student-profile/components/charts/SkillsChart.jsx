import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const LEVEL_SCORES = {
  Expert: 95,
  Intermediate: 70,
  Beginner: 45
};

const LEVEL_COLORS = {
  Expert: "#8B5CF6", // Violet
  Intermediate: "#3B82F6", // Blue
  Beginner: "#9CA3AF" // Gray
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
      <p className="text-xs font-semibold text-gray-800">{data.name}</p>
      <p className="text-xs font-medium text-gray-500">
        Proficiency: <span className="font-bold" style={{ color: data.color }}>{data.level}</span>
      </p>
    </div>
  );
};

export const SkillsChart = ({ technicalSkills = [] }) => {
  const chartData = technicalSkills.map((skill) => ({
    name: skill.name,
    score: LEVEL_SCORES[skill.level] || 50,
    level: skill.level,
    color: LEVEL_COLORS[skill.level] || "#3B82F6"
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Skill Proficiency</h3>
        <p className="text-xs text-gray-400">Technical skills rating comparison</p>
      </div>
      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No technical skills available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={false}
                axisLine={false}
                tickLine={false}
                width={20}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6", opacity: 0.4 }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SkillsChart;
