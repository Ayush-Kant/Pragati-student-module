import { useNavigate, useOutletContext } from "react-router-dom";
import useStudentDetail from "../hooks/useStudentDetail";
import StudentProgressTimeline from "../components/StudentProgressTimeline";
import StudentStatusBadge from "../components/StudentStatusBadge";

const StudentDetail = () => {
    const { darkMode } = useOutletContext();
    const navigate = useNavigate();

    const {
        student,
        drives,
        loading,
        error,
    } = useStudentDetail();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg font-medium">
                    Loading student details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500 font-medium">
                {error}
            </div>
        );
    }

    if (!student) {
        return (
            <div className="p-6">
                Student not found
            </div>
        );
    }

    const drive = drives?.[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div
                className={`rounded-lg shadow p-6 transition ${darkMode
                    ? "bg-slate-900 text-white shadow-black/30"
                    : "bg-white text-slate-900 shadow-slate-200"
                    }`}
            >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Avatar */}
                    <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                        {student.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)}
                    </div>

                    {/* Student Info */}
                    <div>
                        <h1 className="text-2xl font-bold">
                            {student.name}
                        </h1>

                        <p
                            className={
                                darkMode
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }
                        >
                            {student.email}
                        </p>

                        <div className="mt-2">
                            <StudentStatusBadge status={student.status} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Details */}
            <div
                className={`rounded-lg shadow p-6 transition ${darkMode
                    ? "bg-slate-900 text-white shadow-black/30"
                    : "bg-white text-slate-900 shadow-slate-200"
                    }`}
            >
                <h2 className="text-xl font-semibold mb-4">
                    Academic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">College</p>
                        <p>{student.college?.name}</p>
                    </div>

                    <div>
                        <p className="font-semibold">GPA</p>
                        <p>{student.gpa}</p>
                    </div>

                    <div>
                        <p className="font-semibold">
                            Profile Verified
                        </p>
                        <p>
                            {student.profileVerified
                                ? "Yes"
                                : "No"}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold mb-2">
                            Skills
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {student.skills?.map((skill) => (
                                <span
                                    key={skill}
                                    className={`px-3 py-1 rounded-full text-sm ${darkMode
                                        ? "bg-slate-800 text-slate-200"
                                        : "bg-gray-100 text-slate-700"
                                        }`}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            {drive && (
                <div
                    className={`rounded-lg shadow p-6 transition ${darkMode
                        ? "bg-slate-900 text-white shadow-black/30"
                        : "bg-white text-slate-900 shadow-slate-200"
                        }`}
                >
                    <StudentProgressTimeline
                        currentStage={drive.currentStage}
                    />
                </div>
            )}

            {/* Drive Details */}
            {drive ? (
                <div
                    className={`rounded-lg shadow p-6 transition ${darkMode
                            ? "bg-slate-900 text-white shadow-black/30"
                            : "bg-white text-slate-900 shadow-slate-200"
                        }`}
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Drive Details
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold">
                                Drive Name
                            </p>
                            <p>{drive.driveTitle}</p>
                        </div>

                        <div>
                            <p className="font-semibold">
                                Assessment Score
                            </p>
                            <p>{drive.assessmentScore}%</p>
                        </div>

                        <div>
                            <p className="font-semibold">
                                Assignments
                            </p>
                            <p>
                                {drive.assignmentsSubmitted} /{" "}
                                {drive.assignmentsTotal}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">
                                Mentor Feedback
                            </p>

                            <blockquote
                                className={`mt-2 border-l-4 pl-4 italic ${darkMode
                                        ? "border-slate-600 text-slate-300"
                                        : "border-gray-300 text-gray-600"
                                    }`}
                            >
                                {drive.mentorFeedback}
                            </blockquote>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={`rounded-lg shadow p-6 text-center ${darkMode
                            ? "bg-slate-900 text-slate-300"
                            : "bg-white text-slate-600"
                        }`}
                >
                    No drive progress available for this student.
                </div>
            )}

            {/* Back Button */}
            <div>
                <button
                    onClick={() =>
                        navigate("/admin/students")
                    }
                    className="px-5 py-2 rounded-lg bg-blue-700 text-white hover:bg-black transition"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default StudentDetail;