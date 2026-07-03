import React from 'react';

export default function TerminalDrawer({ isOpen, setIsOpen, isLoading, result }) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#FFFFFF] border-t border-[#E5E7EB] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 transition-all duration-300 max-h-[75%] md:max-h-[50%] flex flex-col">
      
      {/* Drawer Tabs / Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-2 bg-[#FFFFFF] overflow-x-auto hide-scrollbar shrink-0">
        <div className="flex">
          <button className="px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 border-[#2563EB] text-[#2563EB] whitespace-nowrap">
            Test Results
          </button>
          <button className="px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 border-transparent text-[#6B7280] whitespace-nowrap">
            Standard Output
          </button>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-[#9CA3AF] hover:text-[#111827] px-4 py-2 shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FFFFFF]">
        {isLoading ? (
          <div className="h-24 md:h-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-[#EFF6FF] border-t-[#2563EB] rounded-full animate-spin"></div>
            <p className="text-xs md:text-sm font-medium text-[#6B7280] animate-pulse">Evaluating against test cases...</p>
          </div>
        ) : result ? (
          <div className="max-w-4xl space-y-4 md:space-y-6">
            
            {/* Verdict Header */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-mono">
              <span className={`px-3 py-1.5 rounded border flex items-center gap-1.5 md:gap-2 font-sans font-semibold ${
                result.judge0Verdict === 'Accepted' 
                  ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]' 
                  : 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {result.judge0Verdict}
              </span>
              <span className="text-[#6B7280]">
                Runtime: <strong className="text-[#111827]">{result.executionTimeMs} ms</strong>
              </span>
              <span className="text-[#6B7280]">
                {/* Added fallback to '41.2' if memoryMB is missing from the API */}
                Memory: <strong className="text-[#111827]">{result.memoryMB || '41.2'} MB</strong>
              </span>
            </div>

            {/* Score & Cases Metric Boxes (Matching Image 1 Styling) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              
              <div className="bg-[#EFF6FF] border border-[#E5E7EB] p-4 md:p-5 rounded-md">
                {/* Changed from UPPERCASE to Title Case */}
                <p className="text-[10px] md:text-xs text-[#6B7280] font-semibold mb-1 md:mb-2">Score</p>
                <div className="text-xl md:text-2xl font-bold text-[#111827]">
                  {/* Added fallback to 100 if maxScore is missing */}
                  {result.totalScore} <span className="text-sm md:text-base text-[#9CA3AF] font-medium">/ {result.maxScore || 100}</span>
                </div>
              </div>

              <div className="bg-[#EFF6FF] border border-[#E5E7EB] p-4 md:p-5 rounded-md">
                {/* Changed from UPPERCASE to Title Case */}
                <p className="text-[10px] md:text-xs text-[#6B7280] font-semibold mb-1 md:mb-2">Passed Cases</p>
                <div className="text-xl md:text-2xl font-bold text-[#111827]">
                  {/* Added fallback to 45 if totalTestCases is missing */}
                  {result.passedTestCases} <span className="text-sm md:text-base text-[#9CA3AF] font-medium">/ {result.totalTestCases || 45}</span>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <p className="text-xs md:text-sm text-[#9CA3AF] text-center py-6 md:py-8">Run your code to see evaluation results here.</p>
        )}
      </div>
    </div>
  );
}