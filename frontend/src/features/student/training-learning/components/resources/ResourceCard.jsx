// ResourceCard.jsx
// Single downloadable/viewable resource row

const TYPE_ICONS = { pdf: "📕", doc: "📘", zip: "🗂️", link: "🔗", notes: "🗒️" };

const ResourceCard = ({ resource, onDownload, onViewNotes }) => {
  const isNotes = resource.type === "notes";

  return (
    <div className="flex items-center justify-between gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0">{TYPE_ICONS[resource.type] || "📄"}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{resource.title}</p>
          <p className="text-xs text-gray-400">{resource.size}</p>
        </div>
      </div>

      {isNotes ? (
        <button
          onClick={() => onViewNotes?.(resource)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0"
        >
          View Notes
        </button>
      ) : (
        <button
          onClick={() => onDownload?.(resource)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0"
        >
          {resource.type === "link" ? "Open Link" : "Download"}
        </button>
      )}
    </div>
  );
};

export default ResourceCard;
