export const validateActivity = (activity) => {
  return (
    activity &&
    activity.id &&
    activity.title?.trim() &&
    activity.description?.trim() &&
    activity.time?.trim() &&
    activity.status?.trim()
  );
};

export const validateRecentUpdate = (update) => {
  return (
    update &&
    update.id &&
    update.title?.trim() &&
    update.date?.trim()
  );
};

export const validateQuickAction = (action) => {
  return (
    action &&
    action.id &&
    action.title?.trim() &&
    action.route?.trim()
  );
};