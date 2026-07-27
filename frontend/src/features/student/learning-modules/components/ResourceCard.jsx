import { FileText, Link2, Video } from "lucide-react";

const ResourceIcon = ({ type }) => {
  switch (type) {
    case "link":
      return <Link2 size={18} className="text-blue-500" />;
    case "video":
      return <Video size={18} className="text-red-500" />;
    case "document":
    case "pdf":
      return <FileText size={18} className="text-emerald-500" />;
    default:
      return <FileText size={18} className="text-slate-400" />;
  }
};

/**
 * Resource card component displaying a learning resource with action button.
 *
 * @param {object} props
 * @param {object} props.resource - Resource data.
 * @returns {JSX.Element}
 */
const ResourceCard = ({ resource }) => {
  const isLink = resource.type === "link";
  const isVideo = resource.type === "video";

  const handleOpen = () => {
    if (isLink || isVideo || resource.type === "document") {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="flex-shrink-0">
        <ResourceIcon type={resource.type} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-slate-900 truncate">
          {resource.title}
        </h4>
        <p className="text-xs text-slate-500 capitalize">{resource.type} Resource</p>
      </div>
      <button
        onClick={handleOpen}
        className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer"
      >
        {resource.type === "pdf" ? "Download" : "Open"}
      </button>
    </div>
  );
};

export default ResourceCard;
