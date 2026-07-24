const AcademicDetails = ({ student, darkMode }) => (
  <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
    <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Academic Details</h3>
    <div className="grid grid-cols-2 gap-3">
      {[
        ["Department", student.department],
        ["Course", student.course],
        ["Batch", student.batch],
        ["Semester", `Semester ${student.semester}`],
        ["CGPA", student.cgpa],
        ["Enrollment No", student.enrollmentNo],
      ].map(([label, value]) => (
        <div key={label}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{value}</p>
        </div>
      ))}
    </div>
  </div>
)

export default AcademicDetails