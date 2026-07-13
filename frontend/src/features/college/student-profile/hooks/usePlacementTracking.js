import { useState, useEffect, useCallback } from "react";
import { getPlacementHistory } from "../services/studentProfileService";

export const usePlacementTracking = (studentId) => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlacements = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getPlacementHistory(studentId);
      
      let placementsArray = [];
      if (Array.isArray(result)) {
        placementsArray = result;
      } else if (result && Array.isArray(result.placementHistory)) {
        placementsArray = result.placementHistory;
      } else if (result && result.data && Array.isArray(result.data.placementHistory)) {
        placementsArray = result.data.placementHistory;
      }

      setPlacements(placementsArray);
    } catch (err) {
      setError(err.message || "Failed to load placement records");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  // Aggregate values safely
  const appliedCount = placements.length;
  
  const interviewsCount = placements.reduce(
    (count, item) => count + (item && Array.isArray(item.rounds) ? item.rounds.filter(r => r.status === "Scheduled").length : 0),
    0
  );
  
  const offersCount = placements.filter(
    (item) => item && (item.status === "Placed" || item.status === "Offered")
  ).length;

  return {
    placements,
    loading,
    error,
    appliedCount,
    interviewsCount,
    offersCount,
    refetch: fetchPlacements,
  };
};

export default usePlacementTracking;
