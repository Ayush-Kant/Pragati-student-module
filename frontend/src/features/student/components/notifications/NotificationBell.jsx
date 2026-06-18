import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = 2;

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full transition-all duration-200 ${
          isOpen ? "bg-blue-100 shadow-sm" : "hover:bg-gray-100"
        }`}
      >
        <Bell
          className={`w-6 h-6 transition ${
            isOpen ? "text-blue-600" : "text-gray-700"
          }`}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-medium min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <NotificationDropdown />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
