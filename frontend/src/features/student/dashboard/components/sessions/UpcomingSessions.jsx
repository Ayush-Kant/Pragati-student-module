import React from "react";
import SessionCard from "./SessionCard";
import { getEmptyMessage } from "../../utils/dashboardHelpers";
import { upcomingSessionsData } from "../../data/dashboardData";


export default function UpcomingSessions() {


  if (!upcomingSessionsData || upcomingSessionsData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <p className="text-gray-500">
          {getEmptyMessage("sessions")}
        </p>
      </div>
    );
  }



  return (

    <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">


      <h2 className="text-xl font-bold text-gray-800 mb-5">
        Upcoming Slots
      </h2>



      <div className="grid md:grid-cols-2 gap-5">


        {upcomingSessionsData.map((session) => (

          <SessionCard
            key={session.id}
            session={session}
          />

        ))}


      </div>


    </div>

  );
}