import PropTypes from "prop-types";

const ProjectCard = ({ project = {}, onEdit, onDelete }) => {
  const tags = project?.skills || project?.technologies || [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {project?.title || "Untitled Project"}
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            {project?.description || "No description available"}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {tags?.length > 0 ? (
              tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No tags</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onEdit?.(project)} className="px-3 py-1 text-sm bg-yellow-100 rounded">
            Edit
          </button>

          <button onClick={() => onDelete?.(project?.id ?? project)} className="px-3 py-1 text-sm bg-red-100 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.string),
    skills: PropTypes.arrayOf(PropTypes.string),
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ProjectCard;
