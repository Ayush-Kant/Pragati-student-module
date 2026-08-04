const SkillProgress = ({ skills }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold text-gray-800">
        Skill Progress
      </h2>

      <div className="space-y-5">
        {skills.map((skill) => (
          <div key={skill.id}>
            <div className="mb-2 flex justify-between">
              <span className="font-medium text-gray-700">
                {skill.skill}
              </span>

              <span className="text-sm font-semibold text-blue-600">
                {skill.progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${skill.progress}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillProgress;