import React from "react";
import TaskCard from "./TaskCard";
import { getEmptyMessage } from "../../utils/dashboardHelpers";
import { pendingTasksData } from "../../data/dashboardData";


export default function PendingTasks() {

  if (pendingTasksData.length === 0) {
    return (
      <p>
        {getEmptyMessage("tasks")}
      </p>
    );
  }

return (
  <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">

    <h2 className="text-xl font-bold text-gray-800 mb-4">
      Pending Tasks
    </h2>


    <div className="grid md:grid-cols-2 gap-5">

      {pendingTasksData.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
        />
      ))}

    </div>

  </div>
);
}