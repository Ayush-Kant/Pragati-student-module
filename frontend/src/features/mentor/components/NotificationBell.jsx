import React, { useState, useEffect, useRef } from "react";
import NotificationDropdown from "./NotificationDropdown";
import useNotifications from "../hooks/useNotifications";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  const { notifications, isLoading, error, markAsRead, fetchNotifications } =
    useNotifications();

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !isOpen;
    setIsOpen(newState);

    if (newState && fetchNotifications) {
      fetchNotifications();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasUnread = notifications && notifications.length > 0;

  return (
    <div style={styles.container} ref={bellRef}>
      <button type="button" onClick={toggleDropdown} style={styles.bellButton}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>

        {hasUnread && <span style={styles.unreadDot}></span>}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          isLoading={isLoading}
          error={error}
          onMarkAsRead={markAsRead}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "inline-block",
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  bellButton: {
    background: "#e0f2fe",
    border: "none",
    cursor: "pointer",
    position: "relative",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  },
  unreadDot: {
    position: "absolute",
    top: "0px",
    right: "0px",
    width: "12px",
    height: "12px",
    backgroundColor: "#ef4444", // Changed to Red
    borderRadius: "50%",
    border: "2px solid #ffffff",
  },
};

export default NotificationBell;
