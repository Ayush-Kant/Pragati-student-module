// Format date to local string
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

// Check if announcement is published
export const isPublished = (status) => {
  return status === "Published";
};

// Check if announcement is draft
export const isDraft = (status) => {
  return status === "Draft";
};

// Filter announcements by search text
export const searchAnnouncements = (announcements, searchText) => {
  if (!searchText) return announcements;

  return announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchText.toLowerCase())
  );
};

// Filter announcements by category
export const filterByCategory = (announcements, category) => {
  if (!category) return announcements;

  return announcements.filter(
    (announcement) => announcement.category === category
  );
};

// Filter announcements by status
export const filterByStatus = (announcements, status) => {
  if (!status) return announcements;

  return announcements.filter(
    (announcement) => announcement.status === status
  );
};