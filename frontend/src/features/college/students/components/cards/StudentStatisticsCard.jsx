const StudentStatisticsCard = ({ students = [], darkMode }) => {
  const total = students.length
  const placed = students.filter((s) => s.placementStatus === "Placed").length
  const eligible = students.filter((s) => s.placementStatus === "Eligible").length
  const notEligible = students.filter((s) => s.placementStatus === "Not Eligible").length
  const avgCgpa = total > 0
    ? (students.reduce((sum, s) => sum + parseFloat(s.cgpa), 0) / total).toFixed(2)
    : "0.00"

  const stats = [
    { label: "Total Students", value: total, bg: darkMode ? "bg-[#ff6d34]/20" : "bg-orange-50", text: darkMode ? "text-[#ff6d34]" : "text-orange-700", icon: "🎓" },
    { label: "Placed", value: placed, bg: darkMode ? "bg-[#00bea3]/20" : "bg-teal-50", text: darkMode ? "text-[#00bea3]" : "text-teal-700", icon: "✅" },
    { label: "Eligible", value: eligible, bg: darkMode ? "bg-[#ff6d34]/20" : "bg-amber-50", text: darkMode ? "text-[#ff6d34]" : "text-amber-700", icon: "📋" },
    { label: "Not Eligible", value: notEligible, bg: darkMode ? "bg-red-500/20" : "bg-red-50", text: darkMode ? "text-red-400" : "text-red-700", icon: "❌" },
    { label: "Avg CGPA", value: avgCgpa, bg: darkMode ? "bg-[#00bea3]/20" : "bg-violet-50", text: darkMode ? "text-[#00bea3]" : "text-violet-700", icon: "📊" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {stats.map((s, i) => (
        <div key={i} className={`${s.bg} rounded-2xl p-4 ${darkMode ? 'border border-[#3D3D3D]' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{s.label}</p>
            <span className="text-lg">{s.icon}</span>
          </div>
          <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

export default StudentStatisticsCard