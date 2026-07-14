import { useState } from "react";

export const useMentorManagement = () => {
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState([]);

  return {
    loading,
    mentors,
    setMentors,
    setLoading,
  };
};