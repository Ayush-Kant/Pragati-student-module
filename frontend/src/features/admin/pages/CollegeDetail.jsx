import useCollegeDetail from "../hooks/useCollegeDetail";
import CollegeStatusBadge from "../components/CollegeStatusBadge";
import CollegeStatsCard from "../components/CollegeStatsCard";
import CollegeActionButtons from "../components/CollegeActionButtons";
import { useNavigate, useOutletContext } from "react-router-dom";

function CollegeDetail() {
    const { college, darkMode } = useOutletContext();
    const { college: collegeFromHook } = useCollegeDetail();
    const pageCollege = collegeFromHook || college;
    const navigate = useNavigate();

    if (!pageCollege) {
        return (
            <div className="p-6">
                College not found
            </div>
        )
    }

    return (
        <>
            <div className={`p-6 transition ${darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
                <h1 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {pageCollege.name}
                </h1>

                <div className="flex items-center gap-4 mt-3 mb-4">
                    <CollegeStatusBadge
                        status={pageCollege.status}
                        collegeName={pageCollege.name}
                    />
                    <CollegeActionButtons
                        status={pageCollege.status}
                        collegeName={pageCollege.name}
                        collegeId={pageCollege.collegeId}
                    />
                </div>

                <div className={`rounded-lg shadow p-6 space-y-4 transition ${darkMode ? "bg-slate-900 shadow-black/30" : "bg-white shadow-slate-200"}`}>
                    <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
                        <strong>Email:</strong>
                        {" "}
                        {pageCollege.email}
                    </p>

                    <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
                        <strong>Location:</strong>
                        {" "}
                        {pageCollege.location}
                    </p>

                    <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
                        <strong>Students:</strong>
                        {" "}
                        {pageCollege.studentStrength}
                    </p>
                    {
                        pageCollege.status === "approved"
                        &&
                        pageCollege.verifiedAt
                        &&
                        <p>
                            <strong>
                                Verified:
                            </strong>
                            {" "}
                            {
                                new Date(
                                    pageCollege.verifiedAt
                                )
                                    .toLocaleDateString()
                            }
                        </p>
                    }

                    <div>
                        <strong>Departments:</strong>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {
                                pageCollege?.departments?.map(
                                    (dept, index) => (
                                        <span
                                            key={`${pageCollege.collegeId}-${index}`}
                                            className={`px-3 py-1 rounded transition ${darkMode ? "bg-slate-800 text-slate-200" : "bg-gray-100 text-slate-700"}`}
                                        >
                                            {dept}
                                        </span>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
            >
                <CollegeStatsCard
                    title="Total Enrolled"
                    value={
                        pageCollege.stats.totalStudentsEnrolled
                    }
                    darkMode={darkMode}
                />
                <CollegeStatsCard
                    title="Total Selected"
                    value={
                        pageCollege?.stats?.totalSelected ?? 0
                    }
                    darkMode={darkMode}
                />
                <CollegeStatsCard
                    title="Active Drives"
                    value={
                        pageCollege.stats.activeDriveCount
                    }
                    darkMode={darkMode}
                />
                <CollegeStatsCard
                    title="Performance Rank"
                    value={`#${pageCollege.stats.performanceRank}`}
                    darkMode={darkMode}
                />
            </div>
            <div className={`rounded-lg shadow p-6 mt-6 space-y-6 transition ${darkMode ? "bg-slate-900 shadow-black/30" : "bg-white shadow-slate-200"}`}>
                {/* Participation */}
                <div>
                    <div className="flex justify-between mb-2">
                        <span>
                            Participation Rate
                        </span>
                        <span>
                            {pageCollege.stats.participationRate}%
                        </span>
                    </div>
                    <div className={`w-full rounded-full h-4 transition ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                        <div className="bg-blue-500 h-4 rounded-full"
                            style={{
                                width:
                                    `${pageCollege.stats.participationRate}%`
                            }}
                        />
                    </div>
                </div>

                {/* Selection */}
                <div>
                    <div className="flex justify-between mb-2">
                        <span>
                            Selection Rate
                        </span>
                        <span>
                            {pageCollege?.stats?.selectionRate ?? 0}%
                        </span>
                    </div>
                    <div className={`w-full rounded-full h-4 transition ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                        <div
                            className="bg-green-500 h-4 rounded-full"
                            style={{
                                width:
                                    `${pageCollege.stats.selectionRate}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* rejection/suspension */}
            {
                (
                    pageCollege.status === "rejected"
                    ||
                    pageCollege.status === "suspended"
                )
                &&
                <div className={`mt-6 p-4 rounded-lg border-l-4 transition
                                    ${pageCollege.status === "rejected"
                        ?
                        `${darkMode ? "bg-red-900 border-red-500 text-red-200" : "bg-red-200 border-red-500 text-red-700"}`
                        :
                        `${darkMode ? "bg-slate-800 border-slate-500 text-slate-200" : "bg-gray-200 border-gray-400 text-gray-700"}`
                    }
                                `} >
                    <h3 className="font-bold mb-2">
                        {
                            pageCollege.status === "rejected"
                                ?
                                "❌ Rejection Reason"
                                :
                                "⚠️ Suspension Reason"
                        }
                    </h3>
                    <p>
                        {
                            pageCollege.rejectionReason
                            ||
                            pageCollege.suspensionReason
                        }
                    </p>
                </div>
            }
            <div className="mt-6 flex">
            <button onClick={() => navigate("/admin/colleges")}
                className="mt-6 px-5 py-2 rounded-lg bg-blue-700 text-white hover:bg-black transition cursor-pointer"
            >
                Back
            </button>
            </div>
        </>
    )
}

export default CollegeDetail;