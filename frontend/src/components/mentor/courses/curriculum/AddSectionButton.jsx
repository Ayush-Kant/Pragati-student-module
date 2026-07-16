import React from 'react';
import { Plus } from 'lucide-react';

export default function AddSectionButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Plus size={14} /> Add New Section
    </button>
  );
}