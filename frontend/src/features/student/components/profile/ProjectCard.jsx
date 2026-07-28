import PropTypes from 'prop-types';

const ProjectCard = ({ project = {}, onEdit, onDelete }) => {
  const tags = Array.isArray(project?.skills)
    ? project.skills
    : Array.isArray(project?.technologies)
      ? project.technologies
      : [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-800">
            {project?.title || 'Untitled Project'}
          </h3>

          <p className="text-sm text-gray-600 mt-2">{project?.description || 'No description available'}</p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {tags.length > 0 ? (
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

        <div className="flex gap-2 shrink-0">
          <button onClick={() => onEdit?.(project)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">
            Edit
          </button>

          <button onClick={() => onDelete?.(project?.id ?? project)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">No skills added</span>
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
