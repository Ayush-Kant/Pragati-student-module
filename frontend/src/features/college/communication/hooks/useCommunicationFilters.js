import { useMemo, useState } from "react";

export const useCommunicationFilters = (announcements = []) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

  const filteredAnnouncements = useMemo(() => {
    return safeAnnouncements.filter((announcement) => {
      if (!announcement) return false;

      const matchesSearch =
        !search ||
        (announcement.title &&
          announcement.title.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        !category ||
        String(announcement.category) === String(category) ||
        String(announcement.category_id) === String(category);

      const matchesStatus =
        !status ||
        announcement.status?.toLowerCase() === status.toLowerCase();

      const matchesDate =
        !date ||
        announcement.publishDate === date ||
        announcement.created_at?.startsWith(date);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    safeAnnouncements,
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

export default useCommunicationFilters;