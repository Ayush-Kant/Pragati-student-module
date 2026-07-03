import React, { useState, useRef } from 'react';
// Import the custom hook (Adjust the path if your folder structure differs slightly)
import { useChallenge } from '../../../hooks/useChallenge';

export default function CodeEditorPanel({ challenge, setIsDrawerOpen, isEvaluating, setIsEvaluating, setExecutionResult }) {
  const [selectedLang, setSelectedLang] = useState(challenge.allowedLanguages[0]?.id || '');
  const [code, setCode] = useState(`class DynamicArray {\n\n    private int[] arr;\n    private int capacity;\n    private int size;\n\n    public DynamicArray(int capacity) {\n        this.capacity = capacity;\n        this.size = 0;\n    }\n\n    // Implement remaining methods...\n}`);
  
  const lineNumbersRef = useRef(null);
  
  // Destructure only the submit function from the hook
  const { submitStudentCode } = useChallenge();

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleReset = () => {
    if(window.confirm("Are you sure you want to reset your code?")) {
      setCode(`class DynamicArray {\n\n}`);
    }
  };

  const handleSubmit = async () => {
    if (isEvaluating) return;
    
    // 1. Trigger UI loading states
    setIsEvaluating(true);
    setIsDrawerOpen(true); 
    setExecutionResult(null); // Clear previous results

    // 2. Call the mock backend
    const result = await submitStudentCode(challenge.id, selectedLang, code);
    
    // 3. Update UI with results and stop loading spinner
    if (result) {
      setExecutionResult(result);
    }
    setIsEvaluating(false);
  };

  return (
    <>
      {/* Responsive Action Toolbar */}
      <div className="h-12 shrink-0 border-b border-[#E5E7EB] bg-[#FFFFFF] flex items-center justify-between px-3 md:px-4">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="bg-[#FFFFFF] text-xs md:text-sm font-medium text-[#111827] border border-[#E5E7EB] rounded px-2 py-1 md:px-3 focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          {challenge.allowedLanguages.map((lang) => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>

        <button 
          onClick={handleReset}
          className="text-xs md:text-sm text-[#6B7280] hover:text-[#111827] bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#E5E7EB] px-3 py-1 rounded font-medium transition"
        >
          Reset Code
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden bg-[#111827] relative">
        {/* Line Numbers Gutter */}
        <div 
          ref={lineNumbersRef}
          className="w-10 md:w-12 shrink-0 bg-[#111827] text-[#6B7280] text-right pr-2 md:pr-3 py-4 font-mono text-xs md:text-sm leading-6 select-none overflow-hidden border-r border-gray-800"
        >
          {code.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* Code Input */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          className="flex-1 bg-[#111827] text-[#F8FAFC] font-mono text-xs md:text-sm leading-6 p-4 pb-24 resize-none outline-none whitespace-pre overflow-auto selection:bg-[#2563EB]/40"
          spellCheck="false"
          wrap="off"
        />

        {/* Sticky Submit Button */}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10">
          <button
            onClick={handleSubmit}
            disabled={isEvaluating}
            className={`transition-all font-semibold text-xs md:text-sm tracking-wide px-4 py-2 md:px-6 md:py-2.5 rounded shadow-lg flex items-center space-x-2 
              ${isEvaluating 
                ? 'bg-[#2563EB]/70 cursor-not-allowed text-white/80' 
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white active:scale-[0.98]'}`}
          >
            {isEvaluating ? 'Evaluating...' : 'Run & Submit Code'}
          </button>
        </div>
      </div>
    </>
  );
}