import { Plus } from 'lucide-react';

export const DrivesHeader = ({ onCreateClick }) => {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recruitment Drives</h1>
        <p className="text-gray-500 mt-1">Manage and track all your recruitment campaigns</p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl hover:shadow-md transition-all text-sm"
      >
        <Plus size={18} />
        Create Drive
      </button>
    </div>
  );
};
