import NotificationTabs from "../components/NotificationTabs";
import NotificationLogTable from "../components/NotificationLogTable";
import NotificationDetailDrawer from "../components/NotificationDetailDrawer";

import useNotifications from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";



export default function NotificationCenter() {
  const navigate = useNavigate();
  const {
    notifications,

    loading,
    error,

    search,
    setSearch,

    activeTab,
    setActiveTab,

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
  } = useNotifications();

  return (
    <div className="p-6">

      {/* ===========================
          Header
      =========================== */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          justify-between
          items-start
          md:items-center
          gap-4
          mb-6
        "
      >
        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Notification Center
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage all notifications
          </p>

        </div>

        <button
           onClick={() => navigate("/admin/notification/compose")}
          className="
            bg-teal-600
            hover:bg-teal-700
            text-white
            px-5
            py-2.5
            rounded-lg
            transition
          "
        >
          + Compose Notification
        </button>

      </div>

      {/* ===========================
          Tabs
      =========================== */}

      <NotificationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ===========================
          Search
      =========================== */}

      <div className="mt-6 mb-5">

        <input
          type="text"
          placeholder="Search by subject or recipient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            md:w-96
            border
            rounded-lg
            px-4
            py-2.5
            outline-none
            focus:ring-2
            focus:ring-teal-500
          "
        />

      </div>

      {/* ===========================
          Error
      =========================== */}

      {error && (

        <div className="bg-red-100 text-red-700 rounded-lg p-4 mb-5">

          {error}

        </div>

      )}

      {/* ===========================
          Loading
      =========================== */}

      {loading ? (

        <div className="space-y-4">

          <div className="h-14 rounded-lg bg-gray-200 animate-pulse"></div>

          <div className="h-14 rounded-lg bg-gray-200 animate-pulse"></div>

          <div className="h-14 rounded-lg bg-gray-200 animate-pulse"></div>

          <div className="h-14 rounded-lg bg-gray-200 animate-pulse"></div>

        </div>

      ) : (

        <>

          {/* ===========================
              Empty State
          =========================== */}

          {notifications.length === 0 ? (

            <div className="bg-white rounded-xl shadow p-12 text-center">

              <h2 className="text-xl font-semibold text-gray-700">

                No Notifications Found

              </h2>

              <p className="text-gray-500 mt-2">

                Try changing your search or filters.

              </p>

            </div>

          ) : (

            <NotificationLogTable
              notifications={notifications}
              onViewNotification={openNotification}

              currentPage={currentPage}
              totalPages={totalPages}
              nextPage={nextPage}
              previousPage={previousPage}

              sortField={sortField}
              sortOrder={sortOrder}
              handleSort={handleSort}
            />

          )}

        </>

      )}

      {/* ===========================
          Detail Drawer
      =========================== */}

      <NotificationDetailDrawer
        isOpen={isDrawerOpen}
        notification={selectedNotification}
        onClose={closeNotification}
      />

    </div>
  );
}