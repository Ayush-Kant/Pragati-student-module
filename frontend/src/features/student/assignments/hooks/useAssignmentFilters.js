import { useMemo, useState } from "react";
import {
  filterAssignmentsByStatus,
  filterAssignmentsBySubject,
  searchAssignments,
  sortAssignmentsByDeadline,
} from "../utils/assignmentHelpers";
import { FILTERS } from "../constants/assignmentConstants";

const useAssignmentFilters = (assignments = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(FILTERS.ALL);
  const [subject, setSubject] = useState(FILTERS.ALL);

  const filteredAssignments = useMemo(() => {
    let filteredData = [...assignments];

    filteredData = searchAssignments(filteredData, searchTerm);
    filteredData = filterAssignmentsByStatus(filteredData, status);
    filteredData = filterAssignmentsBySubject(filteredData, subject);

    return sortAssignmentsByDeadline(filteredData);
  }, [assignments, searchTerm, status, subject]);

  return {
    searchTerm,
    status,
    subject,
    filteredAssignments,
    setSearchTerm,
    setStatus,
    setSubject,
  };
};

export default useAssignmentFilters;