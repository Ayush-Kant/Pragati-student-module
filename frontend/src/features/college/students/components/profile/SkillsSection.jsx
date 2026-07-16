const SkillsSection = ({ student }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">Skills</h3>
    {student.skills && student.skills.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {student.skills.map((skill) => (
          <span key={skill} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
            {skill}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-400">No skills listed</p>
    )}
    <div className="mt-4 space-y-2">
      {student.linkedin && (
        <p className="text-xs text-blue-500 truncate">🔗 {student.linkedin}</p>
      )}
      {student.github && (
        <p className="text-xs text-gray-600 truncate">💻 {student.github}</p>
      )}
    </div>
  </div>
)

export default SkillsSection