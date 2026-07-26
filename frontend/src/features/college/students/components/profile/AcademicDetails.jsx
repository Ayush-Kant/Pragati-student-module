const AcademicDetails = ({ student }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">Academic Details</h3>
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
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-sm font-medium text-gray-700">{value}</p>
        </div>
      ))}
    </div>
  </div>
)

export default AcademicDetails