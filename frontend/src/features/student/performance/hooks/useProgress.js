import { useEffect, useState } from "react";
import { getProgress } from "../services/performanceService";

const useProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getProgress();
        setProgress(data);
      } catch (err) {
        setError("Failed to load progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return {
    progress,
    loading,
    error,
  };
};

export default useProgress;