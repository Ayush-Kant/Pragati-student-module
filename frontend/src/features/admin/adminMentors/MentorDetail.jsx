import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const mockPerformance = {
  mentor: {
    id: "mentor_001",
    name: "Rohit Sharma",
    email: "rohit@uptoskills.com",
    expertise: ["MERN", "React", "Node.js"],
  },
  rating: 4.8,
  totalReviews: 32,
  completionRate: "87%",
  avgAssignmentScore: 74,
  recentFeedback: [
    {
      studentId: "stu_001",
      rating: 5,
      comment: "Very helpful and clear explanations.",
    },
    {
      studentId: "stu_002",
      rating: 4,
      comment: "Good depth on backend topics.",
    },
  ],
};

const mockBatchHistory = [
  {
    driveId: "drive_101",
    batchId: "batch_301",
    title: "MERN Batch 1",
    status: "active",
  },
  {
    driveId: "drive_099",
    batchId: "batch_280",
    title: "React Dev Batch",
    status: "completed",
  },
];

const MentorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/mentors")}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <div>
          <h1 className="text-3xl font-bold">
            Mentor Profile
          </h1>

          <p className="text-gray-500">
            Mentor ID: {id}
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">
              {mockPerformance.mentor.name}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">
              {mockPerformance.mentor.email}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Mentor ID</p>
            <p className="font-semibold">
              {mockPerformance.mentor.id}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Expertise</p>

            <div className="flex flex-wrap gap-2 mt-1">
              {mockPerformance.mentor.expertise.map(
                (skill) => (
                  <span
                    key={skill}
                    className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Rating
          </p>

          <h3 className="text-4xl font-bold mt-2">
            ⭐ {mockPerformance.rating}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Completion Rate
          </p>

          <h3 className="text-4xl font-bold mt-2">
            {mockPerformance.completionRate}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Avg Assignment Score
          </p>

          <h3 className="text-4xl font-bold mt-2">
            {mockPerformance.avgAssignmentScore}
          </h3>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Feedback
        </h2>

        <div className="space-y-4">
          {mockPerformance.recentFeedback.map(
            (feedback, index) => (
              <div
                key={index}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between">
                  <p className="font-semibold">
                    {feedback.studentId}
                  </p>

                  <p>
                    ⭐ {feedback.rating}
                  </p>
                </div>

                <p className="text-gray-600 mt-2">
                  {feedback.comment}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Batch History */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Batch History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  Drive ID
                </th>
                <th className="text-left p-3">
                  Batch ID
                </th>
                <th className="text-left p-3">
                  Title
                </th>
                <th className="text-left p-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {mockBatchHistory.map((batch) => (
                <tr
                  key={batch.batchId}
                  className="border-b"
                >
                  <td className="p-3">
                    {batch.driveId}
                  </td>

                  <td className="p-3">
                    {batch.batchId}
                  </td>

                  <td className="p-3">
                    {batch.title}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        batch.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;