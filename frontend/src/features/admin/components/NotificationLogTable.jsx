import React from "react";
import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function NotificationLogTable({
  notifications,
  onViewNotification,
  currentPage,
  totalPages,
  nextPage,
  previousPage,
  sortField,
  sortOrder,
  handleSort,
}) {
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;

    return sortOrder === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow border">

      {/* Responsive Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

          {/* =========================
              Table Header
          ========================== */}

          <thead className="bg-gray-100">

            <tr>

              {/* Date */}

              <th
                onClick={() => handleSort("sentAt")}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer"
              >
                <div className="flex items-center gap-1">

                  Date

                  {renderSortIcon("sentAt")}

                </div>
              </th>

              {/* Recipient */}

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Recipient Group
              </th>

              {/* Channel */}

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Channel
              </th>

              {/* Subject */}

              <th
                onClick={() => handleSort("subject")}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer"
              >
                <div className="flex items-center gap-1">

                  Subject

                  {renderSortIcon("subject")}

                </div>
              </th>

              {/* Recipient Count */}

              <th
                onClick={() =>
                  handleSort("recipientCount")
                }
                className="px-6 py-4 text-center text-sm font-semibold text-gray-700 cursor-pointer"
              >
                <div className="flex justify-center items-center gap-1">

                  Recipients

                  {renderSortIcon("recipientCount")}

                </div>
              </th>

              {/* Status */}

              <th
                onClick={() => handleSort("status")}
                className="px-6 py-4 text-center text-sm font-semibold text-gray-700 cursor-pointer"
              >
                <div className="flex justify-center items-center gap-1">

                  Status

                  {renderSortIcon("status")}

                </div>
              </th>

            </tr>

          </thead>

          {/* =========================
              Table Body
          ========================== */}

          <tbody className="divide-y divide-gray-200">

            {notifications.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-12 text-center text-gray-500"
                >
                  No notifications found.
                </td>

              </tr>

            ) : (

              notifications.map((notification) => (

                <tr
                  key={notification.id}
                  onClick={() =>
                    onViewNotification(notification)
                  }
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >

                  {/* Date */}

                  <td className="px-6 py-4 text-sm text-gray-700">

                    {notification.sentAt}

                  </td>

                  {/* Recipient */}

                  <td className="px-6 py-4 text-sm font-medium">

                    {notification.recipientGroup}

                  </td>

                  {/* Channel */}

                  <td className="px-6 py-4">

                    <div className="flex flex-wrap gap-2">

                      {notification.channels.map(
                        (channel) => (

                          <span
                            key={channel}
                            className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                          >
                            {channel}
                          </span>

                        )
                      )}

                    </div>

                  </td>

                  {/* Subject */}

                  <td className="px-6 py-4 font-medium text-gray-800">

                    {notification.subject}

                  </td>

                  {/* Recipient Count */}

                  <td className="px-6 py-4 text-center">

                    {notification.recipientCount}

                  </td>

                  {/* Status */}

                  <td className="px-6 py-4 text-center">

                    <StatusBadge
                      status={notification.status}
                    />

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* =========================
    Pagination
========================= */}

<div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t bg-gray-50">

  <p className="text-sm text-gray-600 mb-3 md:mb-0">
    Page <span className="font-semibold">{currentPage}</span> of{" "}
    <span className="font-semibold">{totalPages}</span>
  </p>

  <div className="flex items-center gap-3">

    <button
      onClick={previousPage}
      disabled={currentPage === 1}
      className={`
        px-4
        py-2
        rounded-lg
        border
        transition
        ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100"
        }
      `}
    >
      Previous
    </button>

    <button
      onClick={nextPage}
      disabled={currentPage === totalPages}
      className={`
        px-4
        py-2
        rounded-lg
        border
        transition
        ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100"
        }
      `}
    >
      Next
    </button>

  </div>

</div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }) {
  const badgeStyles = {
    Sent: "bg-green-100 text-green-700",
    Scheduled: "bg-yellow-100 text-yellow-700",
    Draft: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        badgeStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}