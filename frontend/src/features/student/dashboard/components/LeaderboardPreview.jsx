import React from "react";
import { Link } from "react-router-dom";

export default function LeaderboardPreview({ leaderboard = [] }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Batch Leaderboard</h3>
        <Link to="/student/performance" className="text-xs font-semibold text-blue-600 hover:underline">
          View All →
        </Link>
      </div>

      {!leaderboard.length ? (
        <p className="text-sm text-gray-500">Leaderboard data not available.</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg border text-sm ${
                item.isSelf ? "bg-blue-50 border-blue-200 font-semibold" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">#{item.rank}</span>
                <span className="text-gray-900">{item.studentName} {item.isSelf && "(You)"}</span>
              </div>
              <span className="text-blue-600 text-xs font-bold">{item.percentile} percentile</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}