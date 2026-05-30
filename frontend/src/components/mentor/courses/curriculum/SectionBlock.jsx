import React, { useState } from 'react';
import { GripVertical, Pencil, Trash2, ChevronDown } from 'lucide-react';
import LectureRow from './LectureRow';
import AddLectureButton from './AddLectureButton';

export default function SectionBlock({ section, index, modules, onUpdateModules }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(section.title);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const updated = modules.map(m => m.id === section.id ? { ...m, title: titleInput } : m);
    onUpdateModules(updated);
  };

  const handleDeleteSection = () => {
    const updated = modules.filter(m => m.id !== section.id);
    onUpdateModules(updated);
  };

  const handleAddLecture = (type) => {
    const updated = modules.map(m => {
      if (m.id === section.id) {
        const lecNum = `${index + 1}.${m.lectures.length + 1}`;
        return {
          ...m,
          lectures: [
            ...m.lectures,
            {
              id: `lec-${Date.now()}`,
              title: `${lecNum} New ${type} Resource`,
              type: type,
              duration: '05:00',
              status: 'Draft'
            }
          ]
        };
      }
      return m;
    });
    onUpdateModules(updated);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all">
      {/* Header Container Area Elements Row layout */}
      <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200 select-none">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <GripVertical className="text-gray-400 cursor-move shrink-0" size={18} />
          <div className="flex flex-wrap items-center gap-2 min-w-0 w-full">
            {isEditingTitle ? (
              <input 
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                className="px-2 py-0.5 text-sm font-semibold border rounded outline-none focus:ring-1 focus:ring-blue-500 flex-1 max-w-md"
                autoFocus
              />
            ) : (
              <span 
                onClick={() => setIsEditingTitle(true)} 
                className="font-semibold text-sm text-gray-800 truncate cursor-pointer hover:text-blue-600"
              >
                {section.title}
              </span>
            )}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              section.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {section.status}
            </span>
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
              {section.lectures?.length || 0} Lectures • {section.duration || '0m'}
            </span>
          </div>
        </div>

        {/* Action Options Interface Buttons Group */}
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => setIsEditingTitle(!isEditingTitle)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={handleDeleteSection} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
            <Trash2 size={14} />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
            <ChevronDown size={16} className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Lectures Injection List block Node Area loop */}
      {isExpanded && (
        <div className="p-3 bg-white space-y-2 border-t border-gray-100 transition-all">
          {section.lectures && section.lectures.length > 0 ? (
            section.lectures.map((lecture) => (
              <LectureRow 
                key={lecture.id} 
                lecture={lecture} 
                sectionId={section.id}
                modules={modules}
                onUpdateModules={onUpdateModules}
              />
            ))
          ) : (
            <p className="text-center py-4 text-xs font-medium text-gray-400">No lectures mapped in this section node layer container yet.</p>
          )}

          {/* Dedicated Sub Section Trigger Injection Control block action button element */}
          <AddLectureButton onAdd={handleAddLecture} />
        </div>
      )}
    </div>
  );
}