function CollegeStatsCard({ title, value, darkMode }) {
    return (
        <div className={`rounded-lg shadow p-5 hover:shadow-md transition ${darkMode ? "bg-slate-900 text-white shadow-black/30" : "bg-white text-slate-900"}`}>
            <p className="text-sm mb-2">{title}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
        </div>
    )
}

export default CollegeStatsCard;