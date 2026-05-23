import useCollegeDetail from "../hooks/useCollegeDetail";
import CollegeStatusBadge from "../components/CollegeStatusBadge";
import CollegeStatsCard from "../components/CollegeStatsCard";
import CollegeActionButtons from "../components/CollegeActionButtons";
import { useNavigate } from "react-router-dom";

function CollegeDetail() {
    const { college } = useCollegeDetail();
    const navigate = useNavigate();

    if (!college) {
        return (
            <div className="p-6">
                College not found
            </div>
        )
    }

    return (
        <>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">
                    {college.name}
                </h1>

                <div className="flex items-center gap-4 mt-3 mb-4">
                    <CollegeStatusBadge
                        status={college.status}
                        collegeName={college.name}
                    />
                    <CollegeActionButtons
                        status={college.status}
                    />
                </div>

                <div className=" rounded-lg shadow p-6 space-y-4">
                    <p>
                        <strong>Email:</strong>
                        {" "}
                        {college.email}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        {" "}
                        {college.location}
                    </p>

                    <p>
                        <strong>Students:</strong>
                        {" "}
                        {college.studentStrength}
                    </p>
                    {
                        college.status === "approved"
                        &&
                        college.verifiedAt
                        &&
                        <p>
                            <strong>
                                Verified:
                            </strong>
                            {" "}
                            {
                                new Date(
                                    college.verifiedAt
                                )
                                    .toLocaleDateString()
                            }
                        </p>
                    }

                    <div>
                        <strong>Departments:</strong>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {
                                college.departments.map(
                                    (dept, index) => (
                                        <span
                                            key={index}
                                            className=" px-3 py-1 rounded"
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
                        college.stats.totalStudentsEnrolled
                    }
                />
                <CollegeStatsCard
                    title="Total Selected"
                    value={
                        college.stats.totalSelected
                    }
                />
                <CollegeStatsCard
                    title="Active Drives"
                    value={
                        college.stats.activeDriveCount
                    }
                />
                <CollegeStatsCard
                    title="Performance Rank"
                    value={`#${college.stats.performanceRank}`}
                />
            </div>
            <div className=" rounded-lg shadow p-6 mt-6 space-y-6">
                {/* Participation */}
                <div>
                    <div
                        className="flex justify-between mb-2"
                    >
                        <span>
                            Participation Rate
                        </span>
                        <span>
                            {college.stats.participationRate}%
                        </span>
                    </div>
                    <div
                        className="w-full bg-gray-200 rounded-full h-4"
                    >
                        <div
                            className="bg-blue-500 h-4 rounded-full"
                            style={{
                                width:
                                    `${college.stats.participationRate}%`
                            }}
                        />
                    </div>
                </div>

                {/* Selection */}
                <div>
                    <div
                        className="flex justify-between mb-2"
                    >
                        <span>
                            Selection Rate
                        </span>
                        <span>
                            {college.stats.selectionRate}%
                        </span>
                    </div>
                    <div
                        className="w-full bg-gray-200 rounded-full h-4"
                    >
                        <div
                            className="bg-green-500 h-4 rounded-full"
                            style={{
                                width:
                                    `${college.stats.selectionRate}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* rejection/suspension */}
            {
                (
                    college.status === "rejected"
                    ||
                    college.status === "suspended"
                )
                &&
                <div className={`mt-6 p-4 rounded-lg border-l-4
                                    ${college.status === "rejected"
                        ?
                        "bg-red-100 border-red-500 text-red-700"
                        :
                        "bg-gray-100 border-gray-500 text-gray-700"
                    }
                                `} >
                    <h3 className="font-bold mb-2">
                        {
                            college.status === "rejected"
                                ?
                                "Rejection Reason"
                                :
                                "Suspension Reason"
                        }
                    </h3>
                    <p>
                        {
                            college.rejectionReason
                            ||
                            college.suspensionReason
                        }
                    </p>
                </div>
            }
            <button onClick={() => navigate("/admin/colleges")}
                className="mt-6 px-5 py-2 rounded-lg bg-blue-900 text-white hover:bg-black transition cursor-pointer"
            >
                Back
            </button>
        </>
    )
}

export default CollegeDetail;