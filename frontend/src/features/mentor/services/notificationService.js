// Merged mock data supporting both rich toast alerts and timeAgo formats
export const mockNotificationData = [
  {
    id: "mock_001",
    type: "success",
    title: "New Mentee Added",
    message: "Sonal Gupta has been assigned to you.",
    timeAgo: "1m ago",
  },
  {
    id: "mock_002",
    type: "request",
    title: "New Mentee Request",
    message: "New Mentee Request: Aakash Sharma.",
    timeAgo: "5m ago",
  },
  {
    id: "mock_003",
    type: "info",
    title: "Session Reminder",
    message: "Your mentoring session starts in 30 minutes.",
    timeAgo: "30m ago",
  },
  {
    id: "mock_004",
    type: "success",
    title: "Project Submitted",
    message: "Priya Jha submitted UI/UX Project.",
    timeAgo: "1h ago",
  },
  {
    id: "mock_005",
    type: "warning",
    title: "Profile Incomplete",
    message: "Please complete your mentor profile.",
    timeAgo: "2h ago",
  },
  {
    id: "mock_006",
    type: "error",
    title: "Submission Failed",
    message: "Unable to upload your report.",
    timeAgo: "3h ago",
  },
];

const handleAuthError = () => {
  window.location.href = "/login";
};

/**
 * Main API function to fetch notifications.
 * Falls back to mock data if the API request fails or backend isn't ready.
 */
export const fetchNotificationsAPI = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    handleAuthError();
    return [];
  }

  try {
    const response = await fetch("/api/student/notifications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      handleAuthError();
      return [];
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch notifications: ${response.status} ${response.statusText}`,
      );
    }

    // CHECK 1: Ensure the response is actually JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON but received: ${text.slice(0, 100)}...`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error.message || error);
    // Return a clean copy of the mock data for development while backend is building
    return mockNotificationData.map((item) => ({ ...item }));
  }
};
/**
 * Main API function to mark/dismiss a notification as read.
 */
export const markNotificationAsReadAPI = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    handleAuthError();
    return false;
  }

  try {
    const response = await fetch(`/api/v1/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      handleAuthError();
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error(`Error marking ${id} as read:`, error);
    return false;
  }
};

// Backward-compatible aliases for feature/new-mentee-toast imports
export const getRecentNotifications = fetchNotificationsAPI;

export async function dismissNotification(id) {
  const success = await markNotificationAsReadAPI(id);
  return { success, id };
}
