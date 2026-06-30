import { studentApiResponse } from "../types/studentDummyData"

// Simulate API delay
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

let localStudents = [...studentApiResponse.data]
let nextId = Math.max(...localStudents.map((s) => s.id)) + 1

export const getStudents = async () => {
  await delay()
  return { success: true, data: [...localStudents] }
}

export const getStudentById = async (id) => {
  await delay()
  const student = localStudents.find((s) => s.id === id)
  if (!student) return { success: false, message: "Student not found" }
  return { success: true, data: student }
}

export const createStudent = async (studentData) => {
  await delay()
  const newStudent = { ...studentData, id: nextId++, skills: studentData.skills || [] }
  localStudents = [...localStudents, newStudent]
  return { success: true, data: newStudent }
}

export const updateStudent = async (id, studentData) => {
  await delay()
  const index = localStudents.findIndex((s) => s.id === id)
  if (index === -1) return { success: false, message: "Student not found" }
  localStudents[index] = { ...localStudents[index], ...studentData }
  return { success: true, data: localStudents[index] }
}

export const deleteStudent = async (id) => {
  await delay()
  const index = localStudents.findIndex((s) => s.id === id)
  if (index === -1) return { success: false, message: "Student not found" }
  localStudents = localStudents.filter((s) => s.id !== id)
  return { success: true, message: "Student deleted successfully" }
}