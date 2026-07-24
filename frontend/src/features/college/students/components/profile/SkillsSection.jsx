const SkillsSection = ({ student, darkMode }) => (
  <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
    <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Skills</h3>
    {student.skills && student.skills.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {student.skills.map((skill) => (
          <span key={skill} className={`text-xs px-3 py-1 rounded-full font-medium ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-50 text-orange-700'}`}>
            {skill}
          </span>
        ))}
      </div>
    ) : (
      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No skills listed</p>
    )}
    <div className="mt-4 space-y-2">
      {student.linkedin && (
        <p className={`text-xs truncate ${darkMode ? 'text-[#00bea3]' : 'text-blue-500'}`}>🔗 {student.linkedin}</p>
      )}
      {student.github && (
        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>💻 {student.github}</p>
      )}
    </div>
  </div>
)

export default SkillsSection