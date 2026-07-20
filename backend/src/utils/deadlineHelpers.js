// deadlineHelpers.js

/**
 * Checks if the given due date deadline has passed.
 * @param {string|Date} dueDate 
 * @returns {boolean}
 */
export const isDeadlinePassed = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  return now > due;
};
