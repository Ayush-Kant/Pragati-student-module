function NeedsRecruitmentList({ colleges = [] }) {
    return (
        <div className="bg-white rounded-lg shadow p-5 mt-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500 text-xl">
                    ⚠️
                </span>
                <h2 className="font-bold text-lg">
                    These colleges have no active recruitment drive
                </h2>
            </div>
            {
                colleges.length === 0 ?
                    (
                        <div
                            className="bg-green-100 text-green-700 p-3 rounded"
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
                                        className=" bg-yellow-50 border-l-4 border-yellow-400 rounded p-3"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-semibold">
                                                    {college.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Students:
                                                    {college.studentStrength}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-500">
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