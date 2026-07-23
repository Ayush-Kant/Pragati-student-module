import React, { useState } from 'react';
import LeaderboardTable from './LeaderboardTable';

export default function ProblemDescriptionPanel({ challenge }) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] bg-[#FFFFFF] px-2 shrink-0 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'description'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeTab === 'description' ? (
          <div className="text-sm leading-relaxed text-[#111827] font-sans">
            {/* Tags Header */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              <span className="bg-[#F1F5F9] text-[#6B7280] px-2.5 py-1 rounded text-xs font-semibold">Medium</span>
              <span className="bg-[#F1F5F9] text-[#6B7280] px-2.5 py-1 rounded text-xs font-semibold">Data Structures</span>
            </div>

            {/* Simulated Markdown Render */}
            <div className="space-y-4">
              <p>{challenge.description.split('###')[0].trim()}</p>
              
              <h3 className="font-bold text-base mt-6 mb-2 text-[#111827]">Constraints:</h3>
              <ul className="list-disc pl-5 space-y-1 text-[#6B7280]">
                <li>0 &le; n &le; 10^5</li>
                <li>Execution Time Limit: <strong>2000ms</strong></li>
              </ul>
            </div>

            <div className="mt-6 md:mt-8 p-3 md:p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg">
              <h4 className="text-[#111827] font-semibold text-xs uppercase tracking-wider mb-2">Public Test Cases</h4>
              <div className="space-y-2 font-mono text-xs text-[#6B7280] overflow-x-auto">
                <p className="whitespace-nowrap"><strong className="text-[#111827]">Input:</strong> pushback(5), pushback(10), getSize()</p>
                <p className="whitespace-nowrap"><strong className="text-[#111827]">Expected Output:</strong> 2</p>
              </div>
            </div>
          </div>
        ) : (
          <LeaderboardTable challengeId={challenge.id} />
        )}
      </div>
    </>
  );
}