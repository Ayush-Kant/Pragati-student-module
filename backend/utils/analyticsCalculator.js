/**
 * Location: backend/utils/analyticsCalculator.js
 */

/**
 * Parses package strings like '24 LPA', '7.5 LPA', '1200000', '12.5' into float values.
 * Returns 0 if invalid or null.
 */
export const parsePackage = (packageStr) => {
  if (packageStr === undefined || packageStr === null) return 0;
  
  const str = String(packageStr).trim();
  if (!str) return 0;

  // Extract digits and period
  const match = str.match(/[0-9.]+/);
  if (!match) return 0;

  const value = parseFloat(match[0]);
  if (isNaN(value)) return 0;

  return value;
};

/**
 * Calculates the percentage change between previous and current values.
 * Returns formatted string like "+15%" or "-5%" or "0%".
 */
export const calculatePercentageChange = (current, previous) => {
  const cur = parseFloat(current) || 0;
  const prev = parseFloat(previous) || 0;

  if (prev === 0) {
    if (cur > 0) return "+100%";
    return "0%";
  }

  const diff = ((cur - prev) / prev) * 100;
  const rounded = Math.round(diff);
  
  if (rounded > 0) return `+${rounded}%`;
  return `${rounded}%`;
};

/**
 * Calculates placement rate as a percentage string (e.g. '82%').
 */
export const calculatePlacementRate = (placedCount, totalCount) => {
  const placed = parseInt(placedCount, 10) || 0;
  const total = parseInt(totalCount, 10) || 0;

  if (total === 0) return "0%";
  return Math.round((placed / total) * 100) + "%";
};

export default {
  parsePackage,
  calculatePercentageChange,
  calculatePlacementRate,
};
