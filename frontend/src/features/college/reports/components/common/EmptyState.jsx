import { FolderOpen } from "lucide-react";

export const EmptyState = ({ 
  title = "No Reports Found", 
  message = "We couldn't find any reports matching your active filters. Try adjusting your search query or filters.", 
  onReset,
  darkMode 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl max-w-lg mx-auto my-8 ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-slate-100 shadow-sm'}`}>
      <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? 'bg-[#ff6d34]/10 text-[#ff6d34]' : 'bg-orange-50 text-primary'}`}>
        <FolderOpen className="w-8 h-8" />
      </div>
      <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
      <p className={`text-sm mb-6 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition duration-150 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-97 cursor-pointer"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
