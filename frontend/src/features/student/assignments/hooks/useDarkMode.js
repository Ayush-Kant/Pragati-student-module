// useDarkMode.js
// Reads the existing "theme" localStorage key used by adminLayout.jsx.
// Returns the current darkMode boolean and a toggleDarkMode function.
// No new theme system is introduced — this mirrors the admin pattern exactly.
//
// NOTE: window.addEventListener("storage") only fires in OTHER tabs by spec.
// We use a custom "app:theme-change" event to propagate changes within the
// same tab, so all mounted components stay in sync when the button is clicked.

import { useState, useEffect } from "react";

const CUSTOM_EVENT = "app:theme-change";

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    // Cross-tab sync (native storage event)
    const handleStorage = (e) => {
      if (e.key === "theme") {
        setDarkMode(e.newValue === "dark");
      }
    };
    // Same-tab sync (custom event dispatched by toggleDarkMode)
    const handleCustom = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CUSTOM_EVENT, handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CUSTOM_EVENT, handleCustom);
    };
  }, []);

  const toggleDarkMode = () => {
    const next = localStorage.getItem("theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    // Dispatch custom event so every useDarkMode instance in this tab re-reads
    window.dispatchEvent(new Event(CUSTOM_EVENT));
  };

  return { darkMode, toggleDarkMode };
};

export default useDarkMode;
