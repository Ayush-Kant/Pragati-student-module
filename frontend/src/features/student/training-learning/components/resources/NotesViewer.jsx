// NotesViewer.jsx
// Read-only viewer for text-based lesson/course notes

const NotesViewer = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-800">{resource.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        <div className="text-sm text-gray-600 leading-relaxed max-h-80 overflow-y-auto">
          Notes content for "{resource.title}" will be loaded from the backend during integration.
        </div>
      </div>
    </div>
  );
};

export default NotesViewer;
