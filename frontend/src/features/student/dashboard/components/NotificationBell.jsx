import React, { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../../../../services/notification.service";

export default function NotificationBell({ unreadCount = 0 }) {
  const [count, setCount] = useState(Number(unreadCount) || 0);
  const [open, setOpen] = useState(false);

  const refreshCount = useCallback(async () => {
    try {
      const data = await getNotifications({ read: "false", page: 1, limit: 1 });
      setCount(Number(data?.unreadCount || 0));
    } catch {
      setCount(Number(unreadCount) || 0);
    }
  }, [unreadCount]);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
        aria-label={count > 0 ? `View notifications, ${count} unread` : "View notifications"}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="h-6 w-6" />
        {count > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          onUnreadCountChange={setCount}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
