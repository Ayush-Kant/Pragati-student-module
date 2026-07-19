import React, { useEffect } from "react";

export default function NotificationDetailDrawer({
  isOpen,
  notification,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !notification) return null;

  return (
    <>
      {/* Overlay */}

      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-title"
        className="
          fixed
          top-0
          right-0
          h-screen
          w-full
          md:w-175
          bg-white
          shadow-2xl
          z-50
          overflow-y-auto
          animate-slide-in
        "
      >
        {/* Header */}

        <div className="sticky top-0 bg-linear-to-r from-cyan-600 to-blue-600 text-white px-6 py-5 flex justify-between items-center shadow">

          <div>
            <h2
              id="notification-title"
              className="text-2xl font-bold"
            >
              Notification Details
            </h2>

            <p className="text-sm opacity-90 mt-1">
              Complete notification information
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close notification drawer"
            className="
              bg-white
              text-blue-600
              px-4
              py-2
              rounded-lg
              font-medium
              hover:bg-gray-100
              transition
            "
          >
            Close
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-6">

          {/* Subject */}

          <section className="bg-gray-50 border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Subject
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {notification.subject || "N/A"}
            </h3>

          </section>

          {/* Information */}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="border rounded-xl p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Recipient Group
              </p>

              <p className="font-semibold text-lg mt-2">
                {notification.recipientGroup || "N/A"}
              </p>

            </div>

            <div className="border rounded-xl p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Recipient Count
              </p>

              <p className="font-semibold text-lg mt-2">
                {notification.recipientCount ?? 0}
              </p>

            </div>

          </section>

          {/* Channels */}

          <section>

            <p className="text-sm text-gray-500 mb-3">
              Delivery Channels
            </p>

            <div className="flex flex-wrap gap-3">

              {(notification.channels || []).map((channel) => (

                <span
                  key={channel}
                  className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium"
                >
                  {channel}
                </span>

              ))}

            </div>

          </section>

          {/* Status */}

          <section>

            <p className="text-sm text-gray-500 mb-3">
              Status
            </p>

            <span
              className={`px-4 py-2 rounded-full font-semibold
                ${
                  notification.status === "Sent"
                    ? "bg-green-100 text-green-700"
                    : notification.status === "Scheduled"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
            >
              {notification.status || "Unknown"}
            </span>

          </section>

          {/* Message */}

          <section>

            <h3 className="text-lg font-semibold mb-3">
              Message
            </h3>

            <div className="border rounded-xl bg-gray-50 p-5 leading-7 whitespace-pre-wrap text-gray-700">

              {notification.message || "No message available."}

            </div>

          </section>

          {/* Delivery Statistics */}

          <section>

            <h3 className="text-lg font-bold mb-4">
              Delivery Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <StatCard
                title="Email Delivered"
                value={notification.deliveryStats?.emailDelivered ?? 0}
                color="green"
              />

              <StatCard
                title="Email Failed"
                value={notification.deliveryStats?.emailFailed ?? 0}
                color="red"
              />

              <StatCard
                title="In-App Delivered"
                value={notification.deliveryStats?.inAppDelivered ?? 0}
                color="blue"
              />

            </div>

          </section>

          {/* Sent At */}

          <section className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Sent At
            </p>

            <p className="font-semibold text-lg mt-2">
              {notification.sentAt || "-"}
            </p>

          </section>

        </div>

      </aside>
    </>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className={`rounded-xl border p-5 text-center ${colors[color]}`}>
      <p className="text-sm">{title}</p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}