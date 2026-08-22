import { AlertTriangle, X } from "lucide-react";

export const ConfirmationModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone. This will permanently delete the report and remove it from system records.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = true,
  darkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in ${darkMode ? 'bg-black/70' : 'bg-slate-900/60 backdrop-blur-sm'}`}>
      <div className={`relative w-full max-w-md rounded-2xl shadow-xl overflow-hidden border transform transition-all duration-300 scale-100 ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-slate-100'}`}>
        
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition cursor-pointer ${darkMode ? 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2.5 rounded-xl ${isDangerous ? (darkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600") : (darkMode ? "bg-[#ff6d34]/10 text-[#ff6d34]" : "bg-orange-50 text-primary")}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
          </div>
          
          <p className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onCancel}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D] text-gray-300 hover:bg-[#1A1A1A]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2 text-sm font-semibold text-white rounded-xl transition shadow-md cursor-pointer ${
                isDangerous 
                  ? "bg-red-600 hover:bg-red-700 shadow-red-500/10 hover:shadow-red-500/20" 
                  : `${darkMode ? 'bg-[#ff6d34] hover:bg-[#cc5829]' : 'bg-primary hover:bg-primary-hover'} shadow-orange-500/10 hover:shadow-orange-500/20`
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
