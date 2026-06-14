export const validateActivity = (activity) => {
  return (
    activity &&
    activity.id &&
    activity.title &&
    activity.description &&
    activity.time &&
    activity.status
  );
};

export const validateRecentUpdate = (update) => {
  return (
    update &&
    update.id &&
    update.title &&
    update.date
  );
};

export const validateQuickAction = (action) => {
  return (
    action &&
    action.id &&
    action.title &&
    action.route
  );
};