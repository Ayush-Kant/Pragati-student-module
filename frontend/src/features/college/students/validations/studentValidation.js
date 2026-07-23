export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePhone = (phone) => {
  const regex = /^[6-9]\d{9}$/
  return regex.test(phone)
}

export const validateCGPA = (cgpa) => {
  const num = parseFloat(cgpa)
  return !isNaN(num) && num >= 0 && num <= 10
}

export const validateEnrollmentNo = (enrollmentNo) => {
  return enrollmentNo && enrollmentNo.trim().length >= 5
}

export const validateStudent = (data) => {
  const errors = {}

  if (!data.name || data.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters"

  if (!data.enrollmentNo || !validateEnrollmentNo(data.enrollmentNo))
    errors.enrollmentNo = "Valid enrollment number is required"

  if (!data.email || !validateEmail(data.email))
    errors.email = "Valid email is required"

  if (!data.phone || !validatePhone(data.phone))
    errors.phone = "Valid 10-digit phone number is required"

  if (!data.department)
    errors.department = "Department is required"

  if (!data.course)
    errors.course = "Course is required"

  if (!data.batch)
    errors.batch = "Batch is required"

  if (!data.semester)
    errors.semester = "Semester is required"

  if (!data.cgpa || !validateCGPA(data.cgpa))
    errors.cgpa = "CGPA must be between 0 and 10"

  if (!data.placementStatus)
    errors.placementStatus = "Placement status is required"

  return { isValid: Object.keys(errors).length === 0, errors }
}