import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import {
  getRecentNotifications,
  dismissNotification,
} from "../services/notificationService";

const NotificationSchema = z.object({
  id: z.string(),

  type: z.enum([
    "success",
    "error",
    "warning",
    "info",
  ]),

  title: z.string().min(1),

  message: z.string().optional().default(""),
});

export default function useToast() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const hasLoaded = useRef(false);

  // Store timeout IDs
  const timeoutRefs = useRef({});

  const addToast = useCallback((toast) => {
    const result = NotificationSchema.safeParse(toast);

    if (!result.success) {
      return;
    }

    setNotifications((prev) => {
      const alreadyExists = prev.some(
        (item) => item.id === result.data.id
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, result.data];
    });

    const timeoutId = setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((item) => item.id !== result.data.id)
      );

      delete timeoutRefs.current[result.data.id];
    }, 5000);

    timeoutRefs.current[result.data.id] = timeoutId;
  }, []);

  const dismissToast = useCallback(async (id) => {
    // Clear pending timer
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }

    // Remove from UI immediately
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );

    try {
      await dismissNotification(id);
    } catch (error) {
      // Fail silently as required
    }
  }, []);

  useEffect(() => {
    if (hasLoaded.current) {
      return;
    }

    hasLoaded.current = true;

    const loadNotifications = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getRecentNotifications();

        if (Array.isArray(data)) {
          data.forEach(addToast);
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    loadNotifications();

    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout);
      timeoutRefs.current = {};
    };
  }, [navigate, addToast]);

  return {
    notifications,
    addToast,
    dismissToast,
  };
}