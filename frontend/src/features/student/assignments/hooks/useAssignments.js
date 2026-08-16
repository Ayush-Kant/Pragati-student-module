import { useEffect, useState } from "react";
import { getAssignments } from "../services/assignmentService";
import { ERROR_MESSAGES } from "../constants/assignmentConstants";

const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);

        const response = await getAssignments();

        if (response.success) {
          setAssignments(response.data);
        } else {
          setError(ERROR_MESSAGES.FETCH_ASSIGNMENTS);
        }
      } catch (err) {
        setError(err.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getAssignmentById = (id) => {
    return assignments.find((a) => a.id.toString() === id.toString()) || null;
  };

  return {
    assignments,
    loading,
    error,
    getAssignmentById,
  };
};

export default useAssignments;