export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num);
};

export const formatPackage = (pkg) => {
  if (pkg === null || pkg === undefined) return "0 LPA";
  const num = typeof pkg === "string" ? parseFloat(pkg.replace(/[^0-9.]/g, "")) : pkg;
  return isNaN(num) ? "0 LPA" : `${num.toFixed(1)} LPA`;
};

export const formatPercentage = (val) => {
  if (val === null || val === undefined) return "0%";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(num) ? "0%" : `${num.toFixed(1)}%`;
};

export const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return { value: 0, direction: "neutral" };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change).toFixed(1),
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  };
};

export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const cardClass = (darkMode) =>
  `rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ${
    darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
  }`;

export const subtleText = (darkMode) => darkMode ? "text-gray-400" : "text-gray-500";
export const headingText = (darkMode) => darkMode ? "text-white" : "text-[#2D3436]";
