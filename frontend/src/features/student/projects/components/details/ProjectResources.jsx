import { BookOpen, ExternalLink } from 'lucide-react';

/**
 * Project resources list.
 * @param {{ project: object }} props
 */
const ProjectResources = ({ project }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <BookOpen size={16} className="text-blue-400" aria-hidden="true" />
      <h3 className="text-sm font-semibold text-gray-200">Learning Resources</h3>
    </div>
    {!project.resources?.length ? (
      <p className="text-sm text-gray-500">No resources linked for this project.</p>
    ) : (
      <ul className="space-y-2">
        {project.resources.map((res, i) => (
          <li key={i}>
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-white/2 border border-white/6 rounded-xl px-4 py-3
                hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-200 group"
            >
              <span className="text-sm text-gray-300 group-hover:text-blue-300 transition-colors">
                {res.label}
              </span>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-blue-400 flex-shrink-0 transition-colors" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ProjectResources;
