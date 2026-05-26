const VALID_LESSON_STATUSES = new Set(['draft', 'published', 'unpublished']);
const VALID_RESOURCE_TYPES = new Set(['pdf', 'slide', 'link', 'code', 'video']);

const ALLOWED_STATUS_TRANSITIONS = {
  draft: ['published'],
  published: ['unpublished'],
  unpublished: ['published'],
};

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isPositiveInteger = (value) =>
  Number.isInteger(value) && value > 0;

const isNonNegativeInteger = (value) =>
  Number.isInteger(value) && value >= 0;

const toTrimmedString = (value) =>
  typeof value === 'string' ? value.trim() : value;

const normalizeErrors = (errors) => (errors.length ? errors : null);

export const validateReorderLessons = (body) => {
  const errors = [];

  if (!body || !Array.isArray(body.lessonOrder)) {
    return ['lessonOrder must be an array'];
  }

  if (body.lessonOrder.length === 0) {
    return ['lessonOrder cannot be empty'];
  }

  const lessonIds = new Set();
  const orderIndexes = new Set();

  body.lessonOrder.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      errors.push(`lessonOrder[${index}] must be an object`);
      return;
    }

    if (!isPositiveInteger(item.lessonId)) {
      errors.push(`lessonOrder[${index}].lessonId must be a positive integer`);
    } else if (lessonIds.has(item.lessonId)) {
      errors.push(`Duplicate lessonId found: ${item.lessonId}`);
    } else {
      lessonIds.add(item.lessonId);
    }

    if (!isNonNegativeInteger(item.orderIndex)) {
      errors.push(`lessonOrder[${index}].orderIndex must be a non-negative integer`);
    } else if (orderIndexes.has(item.orderIndex)) {
      errors.push(`Duplicate orderIndex found: ${item.orderIndex}`);
    } else {
      orderIndexes.add(item.orderIndex);
    }
  });

  return normalizeErrors(errors);
};

export const validateAddLesson = (body) => {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return ['Request body is required'];
  }

  if (!isNonEmptyString(body.title)) {
    errors.push('title is required');
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }

  if (body.status !== undefined && !VALID_LESSON_STATUSES.has(body.status)) {
    errors.push(`status must be one of: ${Array.from(VALID_LESSON_STATUSES).join(', ')}`);
  }

  if (body.estimatedDuration !== undefined && !isNonNegativeInteger(body.estimatedDuration)) {
    errors.push('estimatedDuration must be a non-negative integer');
  }

  if (body.prerequisites !== undefined) {
    if (!Array.isArray(body.prerequisites)) {
      errors.push('prerequisites must be an array');
    } else if (!body.prerequisites.every(isPositiveInteger)) {
      errors.push('prerequisites must contain only positive integers');
    }
  }

  return normalizeErrors(errors);
};

export const validateUpdateLesson = (body) => {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return ['Request body is required'];
  }

  const hasAnyField =
    body.title !== undefined ||
    body.videoUrl !== undefined ||
    body.hlsUrl !== undefined ||
    body.thumbnailUrl !== undefined ||
    body.duration !== undefined ||
    body.status !== undefined ||
    body.prerequisites !== undefined ||
    body.chapterMarkers !== undefined;

  if (!hasAnyField) {
    return ['At least one field must be provided'];
  }

  if (body.title !== undefined && !isNonEmptyString(body.title)) {
    errors.push('title must be a non-empty string');
  }

  if (body.videoUrl !== undefined && !isNonEmptyString(body.videoUrl)) {
    errors.push('videoUrl must be a non-empty string');
  }

  if (body.hlsUrl !== undefined && !isNonEmptyString(body.hlsUrl)) {
    errors.push('hlsUrl must be a non-empty string');
  }

  if (body.thumbnailUrl !== undefined && !isNonEmptyString(body.thumbnailUrl)) {
    errors.push('thumbnailUrl must be a non-empty string');
  }

  if (body.duration !== undefined && !isNonNegativeInteger(body.duration)) {
    errors.push('duration must be a non-negative integer');
  }

  if (body.status !== undefined && !VALID_LESSON_STATUSES.has(body.status)) {
    errors.push(`status must be one of: ${Array.from(VALID_LESSON_STATUSES).join(', ')}`);
  }

  if (body.prerequisites !== undefined) {
    if (!Array.isArray(body.prerequisites)) {
      errors.push('prerequisites must be an array');
    } else if (!body.prerequisites.every(isPositiveInteger)) {
      errors.push('prerequisites must contain only positive integers');
    }
  }

  if (body.chapterMarkers !== undefined && !Array.isArray(body.chapterMarkers)) {
    errors.push('chapterMarkers must be an array');
  }

  return normalizeErrors(errors);
};

export const validateAddResource = (body) => {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return ['Request body is required'];
  }

  const hasLessonId = body.lessonId !== undefined && body.lessonId !== null;
  const hasCourseId = body.courseId !== undefined && body.courseId !== null;

  if (!hasLessonId && !hasCourseId) {
    errors.push('Either lessonId or courseId must be provided');
  }

  if (hasLessonId && !isPositiveInteger(Number(body.lessonId))) {
    errors.push('lessonId must be a positive integer');
  }

  if (hasCourseId && !isPositiveInteger(Number(body.courseId))) {
    errors.push('courseId must be a positive integer');
  }

  if (!isNonEmptyString(body.title)) {
    errors.push('title is required');
  }

  if (!isNonEmptyString(body.fileUrl)) {
    errors.push('fileUrl is required');
  }

  if (!isNonEmptyString(body.type) || !VALID_RESOURCE_TYPES.has(body.type)) {
    errors.push(`type must be one of: ${Array.from(VALID_RESOURCE_TYPES).join(', ')}`);
  }

  return normalizeErrors(errors);
};

export const validateCheckAccessParams = (params) => {
  if (!params || !isPositiveInteger(Number(params.lessonId))) {
    return ['lessonId must be a positive integer'];
  }

  return null;
};

export const validateDeleteResourceParams = (params) => {
  if (!params || !isPositiveInteger(Number(params.resourceId))) {
    return ['resourceId must be a positive integer'];
  }

  return null;
};

export const validateStatusTransition = (currentStatus, nextStatus) => {
  if (currentStatus === nextStatus) {
    return null;
  }

  const allowedNext = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(nextStatus)) {
    return [`Invalid status transition from ${currentStatus} to ${nextStatus}`];
  }

  return null;
};

export const normalizeLessonPayload = (body) => ({
  title: toTrimmedString(body.title),
  description: toTrimmedString(body.description),
  videoUrl: toTrimmedString(body.videoUrl),
  hlsUrl: toTrimmedString(body.hlsUrl),
  thumbnailUrl: toTrimmedString(body.thumbnailUrl),
  status: toTrimmedString(body.status),
  chapterMarkers: body.chapterMarkers,
  prerequisites: body.prerequisites,
  estimatedDuration: body.estimatedDuration,
  duration: body.duration,
});