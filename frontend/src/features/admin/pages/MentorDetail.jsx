import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import useMentorDetail from "../hooks/useMentorDetail";

import MentorPerformanceCard from "../components/MentorPerformanceCard";

import MentorBatchHistory from "../components/MentorBatchHistory";

export default function MentorDetail() {

  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const {
    loading,
    performance,
    error,
  } = useMentorDetail();

  if (loading) {
    return (
      <div className={`p-6 transition ${darkMode ? "text-white" : "text-slate-900"}`}>
        <div className={`rounded-lg p-6 ${darkMode ? "bg-slate-950 border border-slate-700" : "bg-white"}`}>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`animate-pulse h-12 rounded ${darkMode ? "bg-slate-800" : "bg-gray-200"}`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !performance) {
    return (
      <div className={`p-6 transition ${darkMode ? "text-white" : "text-slate-900"}`}>
        <div className={`rounded-lg p-6 border ${darkMode ? "bg-red-950 border-red-700" : "bg-red-50 border-red-200"}`}>
          <p className={`text-lg font-semibold ${darkMode ? "text-red-200" : "text-red-700"}`}>
            ❌ {error || "Mentor not found"}
          </p>
          <button
            onClick={() => navigate("/admin/mentors")}
            className={`mt-4 px-4 py-2 rounded transition ${darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"}`}
          >
            ← Back to Mentors
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className={`p-6 transition ${darkMode ? "text-white" : "text-slate-900"}`}>

      <h1 className="text-3xl font-bold mb-2">
        {performance.mentor.name}
      </h1>

      <p className="mb-6 text-gray-500">
        Mentor Profile & Performance
      </p>

      <MentorPerformanceCard
        performance={performance}
        darkMode={darkMode}
      />

      <MentorBatchHistory
        batches={performance.batchHistory}
        darkMode={darkMode}
      />

      <div
        className={`rounded-lg shadow p-6 mt-6 ${
          darkMode
            ? "bg-slate-950 border border-slate-700"
            : "bg-white"
        }`}
      >

        <h2 className="text-xl font-bold mb-4">
          Recent Feedback
        </h2>

        {
          performance.recentFeedback && performance.recentFeedback.length > 0 ? (
            performance.recentFeedback.map((feedback) => (

              <div
                key={feedback.studentId}
                className="border-b py-4"
              >

                <p className="font-medium">
                  ⭐ {feedback.rating}/5
                </p>

                <p className="text-gray-600 mt-1">
                  {feedback.comment}
                </p>

              </div>

            ))
          ) : (
            <p className="text-gray-500">No feedback yet</p>
          )
        }

      </div>

      <button
        onClick={() => navigate("/admin/mentors")}
        className={`mt-4 px-4 py-2 border rounded-lg cursor-pointer transition ${darkMode ? "bg-orange-500 border-orange-500 text-white hover:bg-orange-400" : "bg-orange-400 border-orange-400 text-white hover:bg-orange-500"}`}
      >
        ← Back to Mentors
      </button>

    </div>
  );
}