import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { mockActivities, mockStats } from "../hooks/useActivities";

const ActivityContext = createContext();

export const useActivityContext = () => {
  return useContext(ActivityContext);
};

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState(mockActivities);
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addActivity = (newActivity) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const activity = {
          ...newActivity,
          id: Date.now(),
          status: newActivity.status || "pending",
          assignedCount: 0,
          submissionCount: 0,
          dueAt: newActivity.dueDate || newActivity.dueAt,
        };
        setActivities((prev) => [activity, ...prev]);
        setStats((prev) => ({
          ...prev,
          total: prev.total + 1,
          pending:
            prev.pending +
            (activity.status === "pending" || activity.status === "published"
              ? 1
              : 0),
          drafts: prev.drafts + (activity.status === "draft" ? 1 : 0),
        }));
        setLoading(false);
        resolve(activity);
      }, 500);
    });
  };

  const removeActivity = (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <ActivityContext.Provider
      value={{ activities, stats, loading, error, addActivity, removeActivity }}
    >
      {children || <Outlet />}
    </ActivityContext.Provider>
  );
};
