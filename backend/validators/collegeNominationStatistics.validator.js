export const validateStatisticsQuery = (query) => {
  const errors = {}

  if (query.page && isNaN(parseInt(query.page)))
    errors.page = 'Page must be a number'

  if (query.limit && isNaN(parseInt(query.limit)))
    errors.limit = 'Limit must be a number'

  return { isValid: Object.keys(errors).length === 0, errors }
}