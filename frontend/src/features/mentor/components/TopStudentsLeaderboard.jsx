import React from "react";

const badgeColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
const badgeNumbers = ["1", "2", "3"];
const avatarColors = ["bg-pink-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400"];
const domainColors = ["text-blue-500", "text-green-500", "text-purple-500"];

const TopStudentsLeaderboard = ({ students }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-sm text-gray-700">Top Performing Mentees</p>
        <span className="text-blue-500 text-xs cursor-pointer font-medium">View Leaderboard</span>
      </div>

      {!students || students.length === 0 ? (
        <p className="text-gray-400 text-sm">No students found</p>
      ) : (
        <div className="flex flex-col gap-4">
          {students.map((student, index) => (
            <div key={student.studentId} className="flex items-center gap-3">
              {/* Badge */}
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                style={{ backgroundColor: index < 3 ? badgeColors[index] : "#9CA3AF" }}>
                {index + 1}
              </div>

              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {student.name.charAt(0)}
              </div>

              {/* Name + Domain */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{student.name}</p>
                <p className={`text-xs ${domainColors[index % domainColors.length]}`}>
                  {student.domain || "General"}
                </p>
              </div>

              {/* Score */}
              <p className="text-sm font-bold text-blue-600">{student.readinessScore}%</p>
            </div>
          ))}
        </div>
      )}

      <button className="mt-4 text-blue-500 text-xs font-medium flex items-center gap-1">
        View Full Leaderboard →
      </button>
    </div>
  );
};

export default TopStudentsLeaderboard;