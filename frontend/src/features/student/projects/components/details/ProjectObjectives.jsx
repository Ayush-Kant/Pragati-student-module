/**
 * ProjectObjectives — renders the numbered list of project learning objectives.
 *
 * @param {{ objectives: string[] }} props
 */
const ProjectObjectives = ({ objectives }) => {
  if (!objectives?.length) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-200 mb-3">Objectives</h3>
      <ul className="space-y-2">
        {objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
            <span
              className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full
                bg-violet-500/15 border border-violet-500/30
                flex items-center justify-center
                text-xs text-violet-400 font-medium"
            >
              {i + 1}
            </span>
            {obj}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectObjectives;
