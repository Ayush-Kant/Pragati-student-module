import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';

const PreviewCurriculumAccordion = ({ modules }) => {
  const [openModules, setOpenModules] = useState({});

  const toggleModule = (id) => {
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!modules || modules.length === 0) return <div className="text-gray-500">No curriculum available yet.</div>;

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {modules.map((mod, index) => (
        <div key={mod.id || index} className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleModule(mod.id)}
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold text-gray-800">{mod.title}</span>
              <span className="text-xs text-gray-500 mt-1">
                {mod.lectures?.length || 0} Lectures • {mod.duration || '0m'}
              </span>
            </div>
            {openModules[mod.id] ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
          </button>
          
          {openModules[mod.id] && (
            <div className="p-4 bg-white">
              {mod.lectures && mod.lectures.length > 0 ? (
                <ul className="space-y-3">
                  {mod.lectures.map((lecture, i) => (
                    <li key={lecture.id || i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-indigo-500" />
                        <span className="text-gray-700">{lecture.title}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{lecture.duration}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">No lectures added yet.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PreviewCurriculumAccordion;
