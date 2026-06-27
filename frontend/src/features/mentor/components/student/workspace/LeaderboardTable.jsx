import React, { useState } from 'react';

const MOCK_LEADERBOARD = [
  { studentName: "Sarah Jenkins", score: 100, executionTimeMs: 41, date: "2 mins ago" },
  { studentName: "Marcus Rossi", score: 100, executionTimeMs: 42, date: "5 mins ago" },
  { studentName: "David Chen", score: 95, executionTimeMs: 45, date: "12 mins ago" },
  { studentName: "Tom Baker", score: 80, executionTimeMs: 50, date: "1 hour ago" },
];

export default function LeaderboardTable() {
  const [submissions] = useState(MOCK_LEADERBOARD);

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.executionTimeMs - b.executionTimeMs;
  });

  const getPodiumStyle = (index) => {
    if (index === 0) return { rankText: 'text-[#F59E0B] font-black', rowBg: 'bg-[#F59E0B]/5' }; 
    if (index === 1) return { rankText: 'text-[#9CA3AF] font-black', rowBg: 'bg-[#9CA3AF]/5' }; 
    if (index === 2) return { rankText: 'text-[#D97706] font-black', rowBg: 'bg-[#D97706]/5' }; 
    return { rankText: 'text-[#6B7280]', rowBg: 'hover:bg-[#F8FAFC]' };
  };

  if (sortedSubmissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#6B7280]">No submissions yet. Be the first to solve this!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#FFFFFF]">
      {/* Added overflow-x-auto to prevent breaking on narrow screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-xs font-semibold text-[#6B7280] whitespace-nowrap">
              <th className="py-3 px-4 w-12 text-center">Rank</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4 text-right">Score</th>
              <th className="py-3 px-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {sortedSubmissions.map((row, index) => {
              const { rankText, rowBg } = getPodiumStyle(index);
              return (
                <tr key={index} className={`transition-colors ${rowBg}`}>
                  <td className={`py-3 px-4 text-center ${rankText}`}>
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#111827] whitespace-nowrap">
                    {row.studentName}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#111827]">
                    {row.score}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-[#2563EB] whitespace-nowrap">
                    {row.executionTimeMs} ms
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}