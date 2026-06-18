function NeedsRecruitmentList({ colleges = [], darkMode = false }) {
    return (
        <div className={`rounded-lg shadow p-5 mt-6 transition ${darkMode ? "bg-slate-950 shadow-black/30 border border-slate-700" : "bg-white"}`}>
            <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400 text-xl">
                    ⚠️
                </span>
                <h2 className={`font-bold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>
                    These colleges have no active recruitment drive
                </h2>
            </div>
            {
                colleges.length === 0 ?
                    (
                        <div
                            className={`p-3 rounded transition ${darkMode ? "bg-slate-900 text-slate-200" : "text-green-700 bg-green-50"}`}
                        >
                            All colleges have active drives 🎉
                        </div>
                    )
                    :
                    (
                        <div className="space-y-2">
                            {
                                colleges.map((college) => (
                                    <div
                                        key={college.collegeId}
                                        className={`border-l-4 rounded p-3 transition ${darkMode ? "bg-slate-900 border-yellow-400 text-slate-200" : "border-yellow-400 bg-yellow-50"}`}
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <p className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                                                    {college.name}
                                                </p>
                                                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                                    Students:
                                                    {college.studentStrength}
                                                </p>
                                            </div>
                                            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                                Last Drive:
                                                {" "}
                                                {
                                                    new Date(
                                                        college.lastDriveAt
                                                    ).toLocaleDateString()
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
            }
        </div>
    )
}

export default NeedsRecruitmentList;
