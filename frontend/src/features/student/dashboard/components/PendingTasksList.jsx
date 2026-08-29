import React from "react";
import { Link } from "react-router-dom";

export default function PendingTasksList({ tasks = [] }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Pending Tasks</h3>
        <Link to="/student/assignments" className="text-xs font-semibold text-blue-600 hover:underline">
          View All →
        </Link>
      </div>

      {!tasks.length ? (
        <p className="text-sm text-gray-500">No pending assignments or assessments.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <Link
              key={t.taskId}
              to={t.type === "assignment" ? "/student/assignments" : "/student/quizzes"}
              className="block p-3 bg-gray-50 rounded-lg hover:bg-blue-50/50 transition border"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-gray-900">{t.title}</span>
                <span className="text-[11px] font-bold text-red-600 uppercase">
                  Due: {new Date(t.dueAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}