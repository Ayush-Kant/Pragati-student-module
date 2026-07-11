export const validateEligibilityCheck = (data) => {
  const errors = {}

  if (!data.student_id) errors.student_id = 'Student ID is required'

  return { isValid: Object.keys(errors).length === 0, errors }
}