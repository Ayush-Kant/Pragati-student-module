import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

const ConversionFunnelChart = ({
  funnel,
  darkMode,
}) => {
  // Safety Check
  const safeFunnel = Array.isArray(funnel)
    ? funnel
    : [];

  // Empty State
  if (safeFunnel.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-72 text-sm ${
          darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        No funnel data available
      </div>
    );
  }

  // Bar Colors
  const barColors = [
    "#1E3A8A",
    "#2563EB",
    "#60A5FA",
    "#BFDBFE",
  ];

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={safeFunnel}
          layout="vertical"
          margin={{
            top: 10,
            right: 40,
            left: 20,
            bottom: 10,
          }}
        >
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={
              darkMode
                ? "#374151"
                : "#E5E7EB"
            }
            vertical
            horizontal={false}
          />

          {/* X Axis */}
          <XAxis
            type="number"
            tick={{
              fontSize: 12,
              fill: darkMode
                ? "#D1D5DB"
                : "#4B5563",
            }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            dataKey="stage"
            type="category"
            width={100}
            tick={{
              fontSize: 13,
              fontWeight: 500,
              fill: darkMode
                ? "#F3F4F6"
                : "#374151",
            }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            cursor={{
              fill: darkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
            }}
            contentStyle={{
              backgroundColor: darkMode
                ? "#1F2937"
                : "#FFFFFF",
              border: `1px solid ${
                darkMode
                  ? "#374151"
                  : "#E5E7EB"
              }`,
              borderRadius: "12px",
              color: darkMode
                ? "#F9FAFB"
                : "#111827",
              fontSize: "14px",
            }}
            labelStyle={{
              color: darkMode
                ? "#F3F4F6"
                : "#111827",
            }}
            formatter={(value) => [
              `${value} Students`,
              "Count",
            ]}
          />

          {/* Bars */}
          <Bar
            dataKey="count"
            radius={[0, 10, 10, 0]}
            barSize={40}
          >
            {safeFunnel.map(
              (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    barColors[
                      index %
                        barColors.length
                    ]
                  }
                />
              )
            )}

            <LabelList
              dataKey="count"
              position="right"
              style={{
                fill: darkMode
                  ? "#F9FAFB"
                  : "#374151",
                fontSize: 13,
                fontWeight: 600,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversionFunnelChart;