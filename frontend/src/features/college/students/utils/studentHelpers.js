export const getInitials = (name) => {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export const getPlacementColor = (status) => {
  switch (status) {
    case "Placed": return "bg-emerald-100 text-emerald-700"
    case "Eligible": return "bg-blue-100 text-blue-700"
    case "Not Eligible": return "bg-red-100 text-red-700"
    default: return "bg-gray-100 text-gray-600"
  }
}

export const getCgpaColor = (cgpa) => {
  if (cgpa >= 9) return "text-emerald-600"
  if (cgpa >= 8) return "text-blue-600"
  if (cgpa >= 7) return "text-amber-600"
  return "text-red-500"
}

export const formatCgpa = (cgpa) => Number(cgpa).toFixed(2)

export const getResumeColor = (status) => {
  return status === "Uploaded"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-gray-100 text-gray-500"
}