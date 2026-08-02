import React, { useState } from "react";

import UpcomingSessions from "../../dashboard/components/sessions/UpcomingSessions";
import PendingTasks from "../../dashboard/components/tasks/PendingTasks";
import NotificationList from "../../dashboard/components/notifications/NotificationList";


const DashboardPage = () => {

  const [activeTab, setActiveTab] = useState("sessions");


  return (

    <div className="p-6 bg-gray-100 min-h-screen">


      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Student Dashboard
      </h1>


      {/* Buttons */}

      <div className="grid grid-cols-3 gap-4 mb-8">


        <button
          onClick={() => setActiveTab("sessions")}
          className="bg-blue-500 text-white rounded-xl p-5 shadow hover:scale-105"
        >
          📅 Slots
        </button>


        <button
          onClick={() => setActiveTab("tasks")}
          className="bg-purple-500 text-white rounded-xl p-5 shadow hover:scale-105"
        >
          ✅ Tasks
        </button>


        <button
          onClick={() => setActiveTab("notifications")}
          className="bg-green-500 text-white rounded-xl p-5 shadow hover:scale-105"
        >
          🔔 Notifications
        </button>


      </div>



      {/* Content */}

      <div>


        {activeTab === "sessions" && (
          <UpcomingSessions />
        )}


        {activeTab === "tasks" && (
          <PendingTasks />
        )}


        {activeTab === "notifications" && (
          <NotificationList />
        )}


      </div>


    </div>

  );
};


export default DashboardPage;