import { useCallback, useEffect, useState } from "react";
// Uncomment when backend is ready
// import { getDisputeById } from "../services/adminService";

export default function useDisputeDetail(id) {
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mockDispute = {
    id: id || "disp_001",

    filedBy: {
      name: "Rahul Sharma",
      role: "Student",
      email: "rahul@gmail.com",
    },

    against: {
      name: "ABC College",
      role: "College",
      email: "support@abccollege.edu",
    },

    type: "Mentor Issue",

    status: "Open",

    priority: "High",

    createdAt: "2026-06-20T10:30:00Z",

    description:
      "The assigned mentor repeatedly missed scheduled sessions and provided delayed feedback, affecting the completion of the training program. The student requested intervention from the admin team.",

    evidence: [
      {
        id: 1,
        fileName: "Screenshot_of_Chat.png",
        type: "Image",
        uploadedAt: "20 Jun 2026",
        url: "#",
      },
      {
        id: 2,
        fileName: "Attendance_Report.pdf",
        type: "PDF",
        uploadedAt: "21 Jun 2026",
        url: "#",
      },
    ],

    timeline: [
      {
        title: "Dispute Raised",
        description: "Student submitted the dispute.",
        date: "20 Jun 2026",
      },
      {
        title: "Assigned to Admin",
        description: "Admin started reviewing the dispute.",
        date: "21 Jun 2026",
      },
      {
        title: "Evidence Verified",
        description: "Supporting evidence was reviewed by the admin.",
        date: "22 Jun 2026",
      },
      {
        title: "Waiting for Resolution",
        description: "Pending final admin decision.",
        date: "23 Jun 2026",
      },
    ],

    notes: [
      {
        id: 1,
        author: "Admin",
        note: "Need additional clarification from the mentor.",
        createdAt: "21 Jun 2026",
      },
      {
        id: 2,
        author: "Senior Admin",
        note: "Evidence looks valid. Awaiting mentor response.",
        createdAt: "22 Jun 2026",
      },
    ],

    resolution: "",

    resolvedBy: "",

    resolvedAt: "",
  };

  const fetchDispute = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Uncomment when backend is ready
      // const data = await getDisputeById(id);
      // setDispute(data);

      setDispute(mockDispute);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load dispute."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDispute();
  }, [fetchDispute]);

  return {
    dispute,
    loading,
    error,
    refreshDispute: fetchDispute,
  };
}