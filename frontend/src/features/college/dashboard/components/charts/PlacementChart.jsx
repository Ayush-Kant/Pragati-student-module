import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartWrapper from './ChartWrapper'

export const placementData = [
  { month: "Jan", placements: 25 },
  { month: "Feb", placements: 30 },
  { month: "Mar", placements: 38 },
  { month: "Apr", placements: 44 },
  { month: "May", placements: 52 },
  { month: "Jun", placements: 61 }
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">

            <p className="text-xs font-medium text-gray-500">
                { label }
            </p>

            <p className="text-sm font-semibold
            text-gray-900">
                {payload[0].value.toLocaleString()}{" "}
        <span className="font-normal text-gray-500">students placed</span>
            </p>
        </div>
    )
}

const PlacementChart = () => {
  return (
    <ChartWrapper
        title="Placement Analytics"
        subtitle="Student placement growth over time"
        badge="Last 6 months"
    >

        <ResponsiveContainer width="100%" height="100%">

            <LineChart data={placementData}
            margin={{ top:10, right: 16, left: -10, bottom: 0 }}>

                <CartesianGrid 
                strokeDasharray="3 3"
                stroke="#E5E7EB" 
                vertical={false} />

                <XAxis 
                dataKey="month" 
                tick={{ fill: "#6B7280",
                fontSize: 12 }} 
                axisLine={ false } 
                tickLine={ false } 
                dy={8} />

                <YAxis 
                tick={{ fill: "#6B7280",fontSize: 12  }} 
                axisLine={ false } 
                tickLine={ false } 
                width={48} />

                <Tooltip 
                content={<CustomTooltip />} cursor={{ 
                    stroke: "#22C55E", strokeWidth: 1, strokeDasharray: "4 4"
                }} />

                <Line 
                type="monotone" dataKey="placements" stroke="#22C55E" strokeWidth={3} 
                dot ={{
                    r: 4, 
                    fill: "#22C55E", stroke: "#fff", strokeWidth: 2,
                }} 
                activeDot={{
                    r: 6, 
                    fill: "#22C55E", stroke:"#fff", strokeWidth: 2
                }} />
            </LineChart>
        </ResponsiveContainer>

    </ChartWrapper>
  )
}

export default PlacementChart
