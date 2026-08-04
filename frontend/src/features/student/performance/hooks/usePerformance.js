import { useEffect, useState } from "react";
import { getPerformance } from "../services/performanceService";

const usePerformance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await getPerformance();
        setPerformance(data);
      } catch (err) {
        setError("Failed to load performance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  return {
    performance,
    loading,
    error,
  };
};

export default usePerformance;