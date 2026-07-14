import { useState } from "react";

export const useMentorDetail = () => {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(false);

  return {
    mentor,
    setMentor,
    loading,
    setLoading,
  };
};