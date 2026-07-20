import { useState, useEffect, useRef } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { Eye, Pencil } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

const getAvatarBgColor = (avatar) => {
  const av = (avatar || "").toUpperCase();
  if (av === "RP") return "#1e88e5"; // blue
  if (av === "PS") return "#0284c7"; // light blue
  if (av === "AK") return "#3f51b5"; // indigo
  if (av === "SR") return "#00bcd4"; // cyan
  if (av === "VS") return "#1565c0"; // dark blue
  return "#3b82f6"; // default blue
};

export const CandidateRow = ({ candidate, onSelect, onEdit, isSelected, onToggleSelect }) => {
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
    <tr 
      onClick={() => onSelect(candidate)}
      className={`border-b border-gray-100 transition-colors duration-200 cursor-pointer ${
        isSelected ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-blue-50/50'
      }`}
    >
      {/* Checkbox */}
      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(candidate.id)}
          className="h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {/* Candidate Info */}
      <td className="px-6 py-5">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flexShrink: 0 }}>
            <div 
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm"
              style={{ backgroundColor: getAvatarBgColor(candidate.avatar), width: '48px', height: '48px', borderRadius: '50%' }}
            >
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
          <span className="text-lg">🏅</span>
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
