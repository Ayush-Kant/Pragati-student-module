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

const ConversionFunnelChart = ({ funnel }) => {

    // Safety Check
    const safeFunnel = Array.isArray(funnel)
        ? funnel
        : [];

    // Empty State
    if (safeFunnel.length === 0) {
        return (
            <div className="flex items-center justify-center h-72 text-gray-500 text-sm">
                No funnel data available
            </div>
        );
    }

    const barColors = [
        "#1E3A8A", // Applied
        "#2563EB", // Tested
        "#60A5FA", // Trained
        "#BFDBFE", // Selected
    ];

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
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
                        vertical={true}
                        horizontal={false}
                    />

                    {/* X Axis */}
                    <XAxis
                        type="number"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    {/* Y Axis */}
                    <YAxis
                        dataKey="stage"
                        type="category"
                        tick={{ fontSize: 13, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                    />

                    {/* Tooltip */}
                    <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.04)" }}
                        contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            fontSize: "14px",
                        }}
                        formatter={(value) => [`${value} Students`, "Count"]}
                    />

                    {/* Bars */}
                    <Bar
                        dataKey="count"
                        radius={[0, 10, 10, 0]}
                        barSize={40}
                    >
                        {/* Individual Bar Colors */}
                        {safeFunnel.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={barColors[index % barColors.length]}
                            />
                        ))}

                        {/* Count Labels */}
                        <LabelList
                            dataKey="count"
                            position="right"
                            style={{
                                fill: "#374151",
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