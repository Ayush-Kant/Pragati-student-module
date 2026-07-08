const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {project.title}
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            {project.description}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {project.skills?.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(project)}
            className="px-3 py-1 text-sm bg-yellow-100 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(project.id)}
            className="px-3 py-1 text-sm bg-red-100 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
