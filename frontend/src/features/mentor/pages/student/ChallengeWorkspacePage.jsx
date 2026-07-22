import React, { useState } from 'react';
import ProblemDescriptionPanel from '../../components/student/workspace/ProblemDescriptionPanel';
import CodeEditorPanel from '../../components/student/workspace/CodeEditorPanel';
import TerminalDrawer from '../../components/student/workspace/TerminalDrawer';

const MOCK_CHALLENGE = {
  id: "dynamic-array-101",
  title: "Dynamic Array Implementation",
  maxScore: 100,
  allowedLanguages: [
    { id: "java", name: "Java" },
    { id: "python", name: "Python 3" },
    { id: "cpp", name: "C++" }
  ],
  description: `Design and implement a Dynamic Array (similar to an \`ArrayList\` in Java or a \`vector\` in C++). Your implementation should support the following operations:

* \`void pushback(int n)\` - Appends the integer \`n\` to the end of the array.
* \`int popback()\` - Removes and returns the last element in the array.
* \`void resize()\` - Doubles the capacity of the array.
* \`int getSize()\` - Returns the current number of elements in the array.
* \`int getCapacity()\` - Returns the current capacity of the array.

### Constraints:
* 0 <= n <= 10^5
* Execution Time Limit: 2000ms`
};

export default function ChallengeWorkspacePage() {
  const [challenge] = useState(MOCK_CHALLENGE);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-[#111827] overflow-hidden font-sans">
      {/* Responsive Top Navbar */}
      <header className="h-14 shrink-0 border-b border-[#E5E7EB] flex items-center justify-between px-4 md:px-6 bg-[#FFFFFF] z-10 shadow-sm">
        <div className="flex items-center space-x-4 min-w-0">
          <h1 className="text-base md:text-lg font-bold tracking-tight text-[#111827] truncate">
            {challenge.title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-6 shrink-0 ml-2">
          {/* Timer */}
          <div className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm text-[#6B7280]">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-mono tracking-wider">45:00</span>
          </div>
          {/* Theme Toggles (Hidden on very small screens for space) */}
          <div className="hidden sm:flex items-center space-x-3 border-l border-[#E5E7EB] pl-4 md:pl-6">
             <button className="text-[#6B7280] hover:text-[#111827] transition-colors">☀️</button>
             <button className="text-[#6B7280] hover:text-[#111827] transition-colors">🌙</button>
          </div>
        </div>
      </header>

      {/* Split-Pane Interface (Stacks vertically on mobile, side-by-side on md+) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Side: Problem Context */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-[#E5E7EB] bg-[#FFFFFF] flex flex-col overflow-hidden">
          <ProblemDescriptionPanel challenge={challenge} />
        </div>

        {/* Right Side: Code Editor Workspace */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col overflow-hidden bg-[#FFFFFF] relative">
          <CodeEditorPanel 
            challenge={challenge}
            setIsDrawerOpen={setIsDrawerOpen}
            isEvaluating={isEvaluating}
            setIsEvaluating={setIsEvaluating}
            setExecutionResult={setExecutionResult}
          />
        </div>

        {/* Bottom Terminal Drawer */}
        <TerminalDrawer 
          isOpen={isDrawerOpen} 
          setIsOpen={setIsDrawerOpen}
          isLoading={isEvaluating} 
          result={executionResult} 
        />
      </main>
    </div>
  );
}