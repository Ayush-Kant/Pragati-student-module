import React, { useState } from 'react';
import { Plus, Video, FileText, HelpCircle } from 'lucide-react';

export default function AddLectureButton({ onAdd }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="mt-2">
      {showOptions ? (
        <div className="flex gap-2 p-2 border border-dashed border-blue-300 rounded-lg bg-blue-50/50 justify-center animate-fade-in">
          {[
            { type: 'Video', icon: <Video size={14} /> },
            { type: 'Article', icon: <FileText size={14} /> },
            { type: 'Quiz', icon: <HelpCircle size={14} /> }
          ].map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                onAdd(opt.type);
                setShowOptions(false);
              }}
              className="px-3 py-1 bg-white border text-xs font-bold text-gray-700 rounded-md flex items-center gap-1.5 shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              {opt.icon} {opt.type}
            </button>
          ))}
          <button 
            onClick={() => setShowOptions(false)} 
            className="px-2 py-1 text-xs font-bold text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setShowOptions(true)}
          className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-1 transition-all"
        >
          <Plus size={14} /> Add Lecture
        </button>
      )}
    </div>
  );
}