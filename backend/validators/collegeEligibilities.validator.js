export const validateEligibilityCheck = (data) => {
  const errors = {}

  if (!data.student_id) errors.student_id = 'Student ID is required'

  return { isValid: Object.keys(errors).length === 0, errors }
}

export const validateCreateEligibleStudent = (data) => {
  const errors = {}

  if (!data.student_id) errors.student_id = 'Student ID is required'
  if (!data.enrollment_no) errors.enrollment_no = 'Enrollment number is required'
  if (!data.name) errors.name = 'Name is required'
  if (!data.email) errors.email = 'Email is required'
  if (!data.department) errors.department = 'Department is required'
  if (!data.course) errors.course = 'Course is required'
  if (!data.semester) errors.semester = 'Semester is required'
  if (!data.batch) errors.batch = 'Batch is required'
  if (data.cgpa === undefined || data.cgpa < 0 || data.cgpa > 10) errors.cgpa = 'CGPA must be between 0 and 10'

  return { isValid: Object.keys(errors).length === 0, errors }
}