export const validateShortlistUpdate = (data) => {
  const errors = {}
  const validStatuses = ['Shortlisted', 'Selected', 'Rejected', 'On Hold']

  if (!data.status) errors.status = 'Status is required'
  else if (!validStatuses.includes(data.status))
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`

  return { isValid: Object.keys(errors).length === 0, errors }
}