import PropTypes from "prop-types";

const ProjectCard = ({ project = {}, onEdit, onDelete }) => {
  const displaySkills = project?.skills || project?.technologies || [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {project?.title || "Untitled Project"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {project?.description || "No description available"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(project)}
            className="px-3 py-1 text-sm bg-yellow-100 rounded hover:bg-yellow-200 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(project?.id || project)}
            className="px-3 py-1 text-sm bg-red-100 rounded hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {displaySkills.length > 0 ? (
          displaySkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">
            No skills added
          </span>
        )}
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
