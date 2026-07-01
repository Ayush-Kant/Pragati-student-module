import React from "react";
import { formatDate, formatStatus } from "../../utils/dashboardHelpers";


export default function TaskCard({ task }) {

  return (

    <div className="bg-white rounded-2xl p-5 shadow-md border-l-4 border-purple-500 hover:shadow-xl transition">


      <h3 className="text-lg font-bold text-gray-800">
        {task.title}
      </h3>


      <p className="text-gray-600 mt-3">
        📅 Due: {formatDate(task.dueDate)}
      </p>


      <span className="inline-block mt-4 px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
        {formatStatus(task.status)}
      </span>


    </div>

  );
}