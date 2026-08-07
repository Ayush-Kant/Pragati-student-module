import { FileText, Link2, Video } from "lucide-react";

const ResourceIcon = ({ type }) => {
  switch (type) {
    case "link":
      return <Link2 size={18} className="text-orange-400" />;
    case "video":
      return <Video size={18} className="text-orange-400" />;
    case "document":
    case "pdf":
      return <FileText size={18} className="text-orange-400" />;
    default:
      return <FileText size={18} className="text-gray-400" />;
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
    <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex-shrink-0">
        <ResourceIcon type={resource.type} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-100 truncate">
          {resource.title}
        </h4>
        <p className="text-xs text-gray-400 capitalize">{resource.type} Resource</p>
      </div>
      <button
        onClick={handleOpen}
        className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 hover:border-orange-500/40 transition-all duration-300 cursor-pointer"
      >
        {resource.type === "pdf" ? "Download" : "Open"}
      </button>
    </div>
  );
};

export default ResourceCard;
