import React from "react";

const tabs = [
  {
    name: "Inbox",
    count: 3,
  },
  {
    name: "Sent",
    count: 1,
  },
  {
    name: "Templates",
    count: 0,
  },
  {
    name: "Scheduled",
    count: 1,
  },
];

function NotificationTabs({ activeTab, setActiveTab }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-max border-b pb-4">

        {tabs.map((tab) => (

          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`
              flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-lg
              text-sm
              font-medium
              transition-all
              duration-200

              ${
                activeTab === tab.name
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >

            <span>{tab.name}</span>

            <span
              className={`
                px-2
                py-0.5
                rounded-full
                text-xs
                font-semibold

                ${
                  activeTab === tab.name
                    ? "bg-white text-blue-600"
                    : "bg-white text-gray-700"
                }
              `}
            >
              {tab.count}
            </span>

          </button>

        ))}

      </div>
    </div>
  );
}

export default NotificationTabs;