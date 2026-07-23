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
