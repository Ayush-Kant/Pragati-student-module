import { useState, useEffect, useCallback } from "react"
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService"

const useStudentData = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getStudents()
      if (res.success) setStudents(res.data)
      else setError("Failed to load students")
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const addStudent = async (data) => {
    try {
      const res = await createStudent(data)
      if (res.success) setStudents((prev) => [...prev, res.data])
      return res
    } catch (err) {
      const serverErrors = err.response?.data?.errors
      const serverMessage = err.response?.data?.message || err.message
      if (serverErrors?.length) {
        console.error("Student creation validation errors:", serverErrors)
      }
      console.error("Add student failed:", serverMessage)
      return { success: false, message: serverMessage, errors: serverErrors }
    }
  }

  const editStudent = async (id, data) => {
    const res = await updateStudent(id, data)
    if (res.success)
      setStudents((prev) => prev.map((s) => (s.id === id ? res.data : s)))
    return res
  }

  const removeStudent = async (id) => {
    const res = await deleteStudent(id)
    if (res.success) setStudents((prev) => prev.filter((s) => s.id !== id))
    return res
  }

  return {
    students,
    loading,
    error,
    fetchStudents,
    addStudent,
    editStudent,
    removeStudent,
  }
}

export default useStudentData