export const formatAttendance = (value) => {
  if (value === undefined || value === null) return "0%";
  const str = String(value).trim();
  if (str.endsWith("%")) return str;
  return `${str}%`;
};

export const calculateAverageSGPA = (sgpaList) => {
  if (!Array.isArray(sgpaList) || sgpaList.length === 0) return 0;
  const sum = sgpaList.reduce((acc, curr) => acc + (Number(curr.sgpa) || 0), 0);
  return Number((sum / sgpaList.length).toFixed(2));
};

export const calculateCGPA = (sgpaList) => {
  return calculateAverageSGPA(sgpaList);
};

export const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

export const getStatusBadgeClass = (status, colorMap, defaultClass = "bg-gray-50 text-gray-700 border border-gray-100") => {
  if (!status) return defaultClass;
  return colorMap[status] || defaultClass;
};
