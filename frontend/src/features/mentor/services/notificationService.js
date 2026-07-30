// Mock data fallback as requested in the initial requirements
const mockNotificationsData = [
  { id: "m1", type: "request", message: "New Mentee Request: Aakash Sharma.", timeAgo: "5m ago" },
  { id: "m2", type: "success", message: "Priya Jha submitted UI/UX Project.", timeAgo: "1h ago" },
  { id: "m3", type: "alert", message: "Important System Notice: Platform maintenance scheduled.", timeAgo: "2h ago" }
];

const handleAuthError = () => {
  window.location.href = '/login';
};

export const fetchNotificationsAPI = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    handleAuthError();
    return [];
  }

  try {
    const response = await fetch('/api/v1/notifications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      return [];
    }

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    // Returning mock data for development while backend is building
    return mockNotificationsData; 
  }
};

export const markNotificationAsReadAPI = async (id) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    handleAuthError();
    return false;
  }

  try {
    const response = await fetch(`/api/v1/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
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