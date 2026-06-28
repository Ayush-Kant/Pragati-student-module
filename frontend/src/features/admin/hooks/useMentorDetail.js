import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import { getMentorById, getMentorPerformance } from "../services/adminService";





export default function useMentorDetail() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState(null);
  const [error, setError] = useState(null);

  const mockPerformance = {
    mentor: {
      id: "mentor_001",
      name: "Rohit Sharma",
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
    batchHistory: [
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
    ],
  };

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from API
        // const performanceData = await getMentorPerformance(id);

        // setPerformance(performanceData);
      } catch (err) {
        console.warn("Backend unavailable, using mock mentor performance");
        // Use mock data if backend is unavailable
        const updatedMockPerformance = {
          ...mockPerformance,
          mentor: {
            ...mockPerformance.mentor,
            id: id,
          },
        };
        setPerformance(updatedMockPerformance);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPerformance();
    }
  }, [id]);

  return {
    loading,
    performance,
    error,
  };
}
