import { Op } from "@sequelize/core";

export const normalizeTags = (tags) => {
  if (!tags) return [];
  return Array.isArray(tags)
    ? tags.map((tag) => String(tag).trim()).filter(Boolean)
    : String(tags)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
};

export const parseTags = (tags) => normalizeTags(tags);

export const normalizeDiscussionQuery = (query = {}) => {
  const { search, category, tags, sortBy = "latest", page = 1, pageSize = 20 } = query;
  const parsedTags = parseTags(tags);
  const where = {};

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (parsedTags.length) {
    where.tags = { [Op.overlap]: parsedTags };
  }

  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const pageSizeNumber = Number(pageSize) > 0 ? Number(pageSize) : 20;

  return {
    where,
    pagination: {
      page: pageNumber,
      pageSize: pageSizeNumber,
      offset: (pageNumber - 1) * pageSizeNumber,
    },
    sortBy,
  };
};

export const createApiResponse = (success, data = null, message = "Success", metadata = {}) => ({
  success,
  message,
  data,
  metadata,
});
