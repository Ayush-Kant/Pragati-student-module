import { useState, useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import { StageBadge } from './StageBadge';

export const DriveRow = ({ drive, onView, onEdit, onViewCandidates, onChangeStage, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleAction = (callback) => {
    setIsMenuOpen(false);
    if (callback) {
      callback(drive);
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="font-semibold text-gray-900">{drive.driveName}</div>
          <div className="text-sm text-gray-500">{drive.role}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{drive.role}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {drive.candidates}
        </div>
      </td>
      <td className="px-6 py-4">
        <StageBadge stage={drive.stage} />
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">{drive.deadline}</div>
      </td>
      <td className="px-6 py-4 relative">
        <div ref={menuRef} className="inline-block text-left">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
              <button
                type="button"
                onClick={() => handleAction(onView)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 font-medium transition"
              >
                View Drive
              </button>
              <button
                type="button"
                onClick={() => handleAction(onEdit)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 font-medium transition"
              >
                Edit Drive
              </button>
              <button
                type="button"
                onClick={() => handleAction(onViewCandidates)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 font-medium transition"
              >
                View Candidates
              </button>
              <button
                type="button"
                onClick={() => handleAction(onChangeStage)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 font-medium transition"
              >
                Change Stage
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                type="button"
                onClick={() => handleAction(onDelete)}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-[14px] text-red-600 font-medium transition"
              >
                Delete Drive
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
