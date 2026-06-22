import "./../styles/candidateFunnelChart.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#F59E0B",
  "#22C55E",
];

const CandidateFunnelChart = ({ data }) => {
  return (
    <div className="funnel-chart-card">
      <div className="card-header">
        <h2>Candidate Funnel</h2>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
  data={data || []}
  barCategoryGap={28}
  margin={{
    top: 10,
    right: 10,
    left: -20,
    bottom: 0,
  }}
>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eef2f7"
            />

            <XAxis
              dataKey="stage"
              tick={{
                fontSize: 12,
                fill: "#6b7280",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 12,
                fill: "#6b7280",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
            >
              {data?.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandidateFunnelChart;