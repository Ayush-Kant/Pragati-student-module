/**
 * TechnologyStack — renders the set of technology tags for a project.
 *
 * @param {{ techStack: string[] }} props
 */
const TechnologyStack = ({ techStack }) => {
  if (!techStack?.length) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-200 mb-3">Technology Stack</h3>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 rounded-full text-xs font-medium
              bg-violet-500/10 text-violet-300 border border-violet-500/20"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TechnologyStack;
