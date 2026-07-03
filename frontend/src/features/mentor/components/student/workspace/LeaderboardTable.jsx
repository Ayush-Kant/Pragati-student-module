import React, { useState, useEffect } from 'react';
// 1. Import your hook
import { useChallenge } from '../../../hooks/useChallenge';

export default function LeaderboardTable({ challengeId }) {
  const [submissions, setSubmissions] = useState([]);
  
  // 2. Destructure the loading state and fetch function
  const { isLoading, fetchLeaderboard } = useChallenge();

  // 3. Fetch the data when the component mounts
  useEffect(() => {
    const loadData = async () => {
      // Pass the challengeId to your mock service
      const data = await fetchLeaderboard(challengeId);
      if (data) {
        setSubmissions(data);
      }
    };
    loadData();
  }, [challengeId]); // Re-run if the challengeId changes

  // Sorting Handler: Primary Score (DESC), Secondary Execution Time (ASC)
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

  // 4. Show a loading state while fetching from the mock API
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3 border border-[#E5E7EB] rounded-md bg-[#FFFFFF]">
        <div className="w-6 h-6 border-2 border-[#EFF6FF] border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-sm text-[#6B7280]">Loading leaderboard data...</p>
      </div>
    );
  }

  if (sortedSubmissions.length === 0) {
    return (
      <div className="text-center py-12 border border-[#E5E7EB] rounded-md bg-[#FFFFFF]">
        <p className="text-sm text-[#6B7280]">No submissions yet. Be the first to solve this!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-md border border-[#E5E7EB] bg-[#FFFFFF]">
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
                    {row.rank || index + 1}
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