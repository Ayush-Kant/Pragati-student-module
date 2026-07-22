// deadlineHelpers.js

/**
 * Checks if the given due date deadline has passed.
 * @param {string|Date} dueDate 
 * @returns {boolean}
 */
export const isDeadlinePassed = (dueDate) => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return false;
  const now = new Date();
  return now > due;
};
