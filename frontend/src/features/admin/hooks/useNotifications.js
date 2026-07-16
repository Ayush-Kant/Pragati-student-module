import { useEffect, useMemo, useState } from "react";

/*
|--------------------------------------------------------------------------
| Mock Notification Data
|--------------------------------------------------------------------------
*/

const mockNotifications = [
  {
    id: "notif_501",
    subject: "MERN Drive Now Open",
    recipientGroup: "Students",
    channels: ["Email", "In-App"],
    recipientCount: 1432,
    status: "Sent",
    sentAt: "2026-07-10 10:30 AM",
    message:
      "Registration for the MERN Recruitment Drive has started.",
    deliveryStats: {
      emailDelivered: 1410,
      emailFailed: 22,
      inAppDelivered: 1432,
    },
  },
  {
    id: "notif_502",
    subject: "Campus Placement Registration",
    recipientGroup: "Colleges",
    channels: ["Email"],
    recipientCount: 124,
    status: "Scheduled",
    sentAt: "2026-07-15 09:00 AM",
    message:
      "Placement registration opens from next Monday.",
    deliveryStats: {
      emailDelivered: 0,
      emailFailed: 0,
      inAppDelivered: 0,
    },
  },
  {
    id: "notif_503",
    subject: "Interview Schedule",
    recipientGroup: "Companies",
    channels: ["In-App"],
    recipientCount: 36,
    status: "Draft",
    sentAt: "-",
    message:
      "Interview schedule will be announced shortly.",
    deliveryStats: {
      emailDelivered: 0,
      emailFailed: 0,
      inAppDelivered: 0,
    },
  },
];

export default function useNotifications() {
  /*
  |--------------------------------------------------------------------------
  | States
  |--------------------------------------------------------------------------
  */

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("Inbox");

  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const [sortField, setSortField] = useState("subject");
  const [sortOrder, setSortOrder] = useState("asc");

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Load Notifications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      setLoading(true);

      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Unable to load notifications.");
      setLoading(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredNotifications = useMemo(() => {
  let filtered = [...notifications];

  // Search
  if (search.trim()) {
    filtered = filtered.filter((notification) =>
      notification.subject
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  // Tabs
  switch (activeTab) {
    case "Sent":
      filtered = filtered.filter(
        (notification) => notification.status === "Sent"
      );
      break;

    case "Scheduled":
      filtered = filtered.filter(
        (notification) => notification.status === "Scheduled"
      );
      break;

    case "Templates":
      // Your teammate will implement this.
      filtered = [];
      break;

    case "Inbox":
    default:
      // Show all notifications
      break;
  }

  return filtered;
}, [notifications, search, activeTab]);

  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const sortedNotifications = useMemo(() => {
    const sorted = [...filteredNotifications];

    sorted.sort((a, b) => {
      if (sortField === "subject") {
        return sortOrder === "asc"
          ? a.subject.localeCompare(b.subject)
          : b.subject.localeCompare(a.subject);
      }

      if (sortField === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }

      if (sortField === "recipientCount") {
        return sortOrder === "asc"
          ? a.recipientCount - b.recipientCount
          : b.recipientCount - a.recipientCount;
      }

      return sortOrder === "asc"
        ? a.sentAt.localeCompare(b.sentAt)
        : b.sentAt.localeCompare(a.sentAt);
    });

    return sorted;
  }, [filteredNotifications, sortField, sortOrder]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.ceil(
    sortedNotifications.length / ITEMS_PER_PAGE
  );

  const paginatedNotifications = sortedNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /*
  |--------------------------------------------------------------------------
  | Sorting Action
  |--------------------------------------------------------------------------
  */

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Pagination Actions
  |--------------------------------------------------------------------------
  */

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Drawer
  |--------------------------------------------------------------------------
  */

  const openNotification = (notification) => {
    setSelectedNotification(notification);
    setIsDrawerOpen(true);
  };

  const closeNotification = () => {
    setSelectedNotification(null);
    setIsDrawerOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Return
  |--------------------------------------------------------------------------
  */

  return {
    notifications: paginatedNotifications,

    loading,
    error,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    selectedNotification,

    isDrawerOpen,

    openNotification,
    closeNotification,

    currentPage,
    totalPages,
    nextPage,
    previousPage,

    sortField,
    sortOrder,
    handleSort,
  };
}