import { useMemo, useState } from "react";
import {
  isSessionToday,
  isSessionThisWeek,
  isSessionThisMonth,
} from "../utils/liveSessionHelpers";

const DATE_PREDICATES = {
  all: () => true,
  today: (s) => isSessionToday(s.date),
  week: (s) => isSessionThisWeek(s.date),
  month: (s) => isSessionThisMonth(s.date),
};

/**
 * Client-side search + status + date + trainer filtering for a session list.
 * Responsibilities: search sessions, status filter, date filter, trainer filter.
 */
export function useSessionFilters(sessions = []) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [dateRange, setDateRange] = useState("all");
  const [trainer, setTrainer] = useState("All");

  const trainerOptions = useMemo(() => {
    const names = new Set(sessions.map((s) => s.trainer).filter(Boolean));
    return ["All", ...Array.from(names)];
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();
    const dateCheck = DATE_PREDICATES[dateRange] || DATE_PREDICATES.all;

    return sessions.filter((s) => {
      const matchesSearch =
        !query ||
        s.title?.toLowerCase().includes(query) ||
        s.trainer?.toLowerCase().includes(query);
      const matchesStatus = status === "All" || s.status === status;
      const matchesTrainer = trainer === "All" || s.trainer === trainer;
      const matchesDate = dateCheck(s);
      return matchesSearch && matchesStatus && matchesTrainer && matchesDate;
    });
  }, [sessions, search, status, dateRange, trainer]);

  const resetFilters = () => {
    setSearch("");
    setStatus("All");
    setDateRange("all");
    setTrainer("All");
  };

  return {
    search,
    setSearch,
    status,
    setStatus,
    dateRange,
    setDateRange,
    trainer,
    setTrainer,
    trainerOptions,
    filteredSessions,
    resetFilters,
  };
}
