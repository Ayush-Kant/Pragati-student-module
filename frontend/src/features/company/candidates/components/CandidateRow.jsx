import { useState, useEffect, useRef } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { Eye, Pencil } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const CandidateRow = ({ candidate, onSelect, onEdit }) => {
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
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors duration-200">
      {/* Candidate Info */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4" onClick={() => onSelect(candidate)}>
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {candidate.avatar}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-base">{candidate.name}</p>
          </div>
        </div>
      </td>

      {/* College */}
      <td className="px-6 py-5">
        <p className="text-gray-700 font-medium">{candidate.college}</p>
      </td>

      {/* Role */}
      <td className="px-6 py-5">
        <p className="text-gray-700 font-medium">{candidate.role}</p>
      </td>

      {/* Score */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">📌</span>
          <span className="font-bold text-gray-900 text-base">{candidate.score}%</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <StatusBadge status={candidate.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(prev => !prev);
            }}
            className="p-2 hover:bg-gray-200/60 rounded-lg transition-colors duration-150"
          >
            <FiMoreVertical size={20} className="text-gray-500" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+4px)] w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onSelect(candidate);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 transition text-left"
              >
                <Eye size={15} className="text-gray-400" />
                View Profile
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onEdit(candidate);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 transition text-left"
              >
                <Pencil size={15} className="text-gray-400" />
                Edit Candidate
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
