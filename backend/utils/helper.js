export const sanitizeString = (str) => {
  if (!str) return ''
  return str.toString().trim().replace(/[<>]/g, '')
}

export const isValidCGPA = (cgpa) => {
  const num = parseFloat(cgpa)
  return !isNaN(num) && num >= 0 && num <= 10
}

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const formatDate = (date) => {
  if (!date) return null
  return new Date(date).toISOString().split('T')[0]
}