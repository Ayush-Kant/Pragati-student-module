export const validateNomination = (data) => {
  const errors = {}

  if (!data.student_id) errors.student_id = 'Student ID is required'
  if (!data.company_id) errors.company_id = 'Company ID is required'
  if (!data.company_name || data.company_name.trim().length < 2)
    errors.company_name = 'Company name is required'

  return { isValid: Object.keys(errors).length === 0, errors }
}

export const validateNominationUpdate = (data) => {
  const errors = {}
  const validStatuses = ['Pending', 'Approved', 'Rejected', 'Withdrawn']

  if (!data.status) errors.status = 'Status is required'
  else if (!validStatuses.includes(data.status))
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`

  return { isValid: Object.keys(errors).length === 0, errors }
}