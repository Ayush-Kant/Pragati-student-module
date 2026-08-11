import { useState, useEffect, useCallback } from "react";
import { projectService } from "../services/projectService";

export const useProjectReviews = (projectId) => {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjectReviews(projectId);
      setReviews(data);
    } catch (err) {
      setError(err.message || "Failed to fetch project reviews.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addCommentReply = (commentText) => {
    if (!reviews || !commentText.trim()) return;
    const newReply = {
      id: `rev-c${Date.now()}`,
      author: {
        name: "Rahul Verma",
        role: "Student Team Lead",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      content: commentText.trim(),
      timestamp: new Date().toISOString(),
      type: "STUDENT_REPLY",
    };

    setReviews((prev) => ({
      ...prev,
      comments: [...prev.comments, newReply],
    }));
  };

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    addCommentReply,
  };
};
