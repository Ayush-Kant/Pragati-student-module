const StudentStatisticsCard = ({ students = [] }) => {
  const total = students.length
  const placed = students.filter((s) => s.placementStatus === "Placed").length
  const eligible = students.filter((s) => s.placementStatus === "Eligible").length
  const notEligible = students.filter((s) => s.placementStatus === "Not Eligible").length
  const avgCgpa = total > 0
    ? (students.reduce((sum, s) => sum + parseFloat(s.cgpa), 0) / total).toFixed(2)
    : "0.00"

  const stats = [
    { label: "Total Students", value: total, bg: "bg-blue-50", text: "text-blue-700", icon: "🎓" },
    { label: "Placed", value: placed, bg: "bg-emerald-50", text: "text-emerald-700", icon: "✅" },
    { label: "Eligible", value: eligible, bg: "bg-amber-50", text: "text-amber-700", icon: "📋" },
    { label: "Not Eligible", value: notEligible, bg: "bg-red-50", text: "text-red-700", icon: "❌" },
    { label: "Avg CGPA", value: avgCgpa, bg: "bg-violet-50", text: "text-violet-700", icon: "📊" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {stats.map((s, i) => (
        <div key={i} className={`${s.bg} rounded-2xl p-4`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">{s.label}</p>
            <span className="text-lg">{s.icon}</span>
          </div>
          <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

export default StudentStatisticsCard