import { CheckSquare, Package, ExternalLink } from 'lucide-react';

/**
 * Requirements & Deliverables section.
 * @param {{ project: object }} props
 */
const ProjectRequirements = ({ project }) => (
  <div className="space-y-8">
    {/* Requirements */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare size={16} className="text-violet-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-gray-200">Technical Requirements</h3>
      </div>
      <ul className="space-y-2">
        {project.requirements?.map((req, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400 bg-white/2 border border-white/5 rounded-lg px-4 py-2.5">
            <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-violet-500 mt-2" aria-hidden="true" />
            {req}
          </li>
        ))}
      </ul>
    </div>

    {/* Deliverables */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Package size={16} className="text-teal-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-gray-200">Deliverables</h3>
      </div>
      <ul className="space-y-2">
        {project.deliverables?.map((del, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400 bg-white/2 border border-white/5 rounded-lg px-4 py-2.5">
            <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-500 mt-2" aria-hidden="true" />
            {del}
          </li>
        ))}
      </ul>
    </div>

    {/* Evaluation criteria */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ExternalLink size={16} className="text-yellow-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-gray-200">Evaluation Criteria</h3>
      </div>
      <div className="space-y-2">
        {project.evaluationCriteria?.map((ec) => (
          <div key={ec.id} className="flex items-center justify-between bg-white/2 border border-white/5 rounded-lg px-4 py-2.5">
            <span className="text-sm text-gray-300">{ec.criterion}</span>
            <span className="text-sm font-semibold text-yellow-400">{ec.weight}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProjectRequirements;
