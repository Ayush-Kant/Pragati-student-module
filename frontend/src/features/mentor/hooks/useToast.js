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
    "info"
  ]),

  title: z.string().min(1),

  message: z.string()
    .optional()
    .default(""),
});


export default function useToast() {

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const hasLoaded = useRef(false);



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


      return [
        ...prev,
        result.data
      ];

    });



    // Auto remove after 5 seconds

    setTimeout(() => {

      setNotifications((prev) =>
        prev.filter(
          (item) => item.id !== result.data.id
        )
      );

    }, 5000);


  }, []);




  const dismissToast = useCallback(async (id) => {


    // Remove immediately from UI

    setNotifications((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );


    try {

      await dismissNotification(id);

    } catch (error) {

      // Fail silently as required

    }


  }, []);




  useEffect(() => {


    // Prevent duplicate loading in React StrictMode

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



  }, [navigate, addToast]);




  return {

    notifications,

    addToast,

    dismissToast,

  };

}