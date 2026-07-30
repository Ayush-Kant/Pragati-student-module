import { useMemo, useState } from "react";

export const useCommunicationFilters = (announcements = []) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => {
      const matchesSearch =
        !search ||
        announcement.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        !category ||
        announcement.category === category;

      const matchesStatus =
        !status ||
        announcement.status === status;

      const matchesDate =
        !date ||
        announcement.publishDate === date;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    announcements,
    search,
    category,
    status,
    date,
  ]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setDate("");
  };

  return {
    search,
    setSearch,

    category,
    setCategory,

    status,
    setStatus,

    date,
    setDate,

    filteredAnnouncements,

    resetFilters,
  };
};