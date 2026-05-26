import { Plus } from 'lucide-react';

export const DrivesHeader = ({ onCreateClick }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recruitment Drives</h1>
        <p className="text-gray-500 mt-1">Manage and track all your recruitment campaigns</p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
      >
        <Plus size={20} />
        Create Drive
      </button>
    </div>
  );
};
