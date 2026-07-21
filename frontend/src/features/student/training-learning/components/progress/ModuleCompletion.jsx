// ModuleCompletion.jsx
// Visualizes module-by-module completion for a single course

const ModuleCompletion = ({ completedModules = 0, totalModules = 0 }) => {
  const modules = Array.from({ length: totalModules }, (_, i) => i < completedModules);

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span className="font-medium">Module Completion</span>
        <span>
          {completedModules}/{totalModules} modules
        </span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {modules.map((done, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 min-w-[16px] rounded-full ${done ? "bg-blue-600" : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleCompletion;
