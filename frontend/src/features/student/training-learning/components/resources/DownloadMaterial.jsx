// DownloadMaterial.jsx
// Confirms and triggers a resource download (wired to a real file URL during integration)

const DownloadMaterial = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
        <span className="text-4xl">⬇️</span>
        <h3 className="text-base font-semibold text-gray-800 mt-3">{resource.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{resource.size}</p>
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <a
            href={resource.url}
            download
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default DownloadMaterial;
