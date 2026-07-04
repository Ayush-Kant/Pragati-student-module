import { useState, useMemo } from "react"

const useStudentFilters = (students) => {
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("All")
  const [course, setCourse] = useState("All")
  const [batch, setBatch] = useState("All")
  const [semester, setSemester] = useState("All")
  const [placementStatus, setPlacementStatus] = useState("All")

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())

      const matchDept = department === "All" || s.department === department
      const matchCourse = course === "All" || s.course === course
      const matchBatch = batch === "All" || s.batch === batch
      const matchSemester = semester === "All" || String(s.semester) === semester
      const matchStatus = placementStatus === "All" || s.placementStatus === placementStatus

      return matchSearch && matchDept && matchCourse && matchBatch && matchSemester && matchStatus
    })
  }, [students, search, department, course, batch, semester, placementStatus])

  const resetFilters = () => {
    setSearch("")
    setDepartment("All")
    setCourse("All")
    setBatch("All")
    setSemester("All")
    setPlacementStatus("All")
  }

  return {
    search, setSearch,
    department, setDepartment,
    course, setCourse,
    batch, setBatch,
    semester, setSemester,
    placementStatus, setPlacementStatus,
    filteredStudents,
    resetFilters,
  }
}

export default useStudentFilters