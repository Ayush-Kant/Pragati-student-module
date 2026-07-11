import React from "react";
import { formatDate, formatStatus } from "../../utils/dashboardHelpers";


export default function SessionCard({ session }) {

  if (!session) {
    return null;
  }


  return (

    <div className="bg-white rounded-2xl p-5 shadow-md border-l-4 border-blue-500 hover:shadow-xl transition">


      <h3 className="text-lg font-bold text-gray-800">
        {session.title}
      </h3>


      <p className="text-gray-600 mt-3">
        📅 {formatDate(session.date)}
      </p>


      <p className="text-gray-600">
        ⏰ {session.time}
      </p>


      <span className="inline-block mt-4 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
        {formatStatus(session.status)}
      </span>


    </div>

  );
}