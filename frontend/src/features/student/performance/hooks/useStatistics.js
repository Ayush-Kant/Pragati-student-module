import { useEffect, useState } from "react";
import { getStatistics } from "../services/performanceService";

const useStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
      } catch (err) {
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
  };
};

export default useStatistics;