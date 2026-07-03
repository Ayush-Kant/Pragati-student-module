import { useState } from "react"
import useStudentData from "../hooks/useStudentData"
import useStudentFilters from "../hooks/useStudentFilters"
import usePagination from "../hooks/usePagination"

import StudentStatisticsCard from "../components/cards/StudentStatisticsCard"
import StudentTable from "../components/table/StudentTable"
import StudentCard from "../components/cards/StudentCard"
import StudentPagination from "../components/table/StudentPagination"
import SearchStudent from "../components/filters/SearchStudent"
import DepartmentFilter from "../components/filters/DepartmentFilter"
import CourseFilter from "../components/filters/CourseFilter"
import BatchFilter from "../components/filters/BatchFilter"
import StatusFilter from "../components/filters/StatusFilter"
import StudentProfilePreview from "../components/profile/StudentProfilePreview"
import StudentForm from "../components/forms/StudentForm"
import EditStudentForm from "../components/forms/EditStudentForm"
import DeleteStudentModal from "../components/forms/DeleteStudentModal"
import LoadingSpinner from "../components/common/LoadingSpinner"
import ErrorState from "../components/common/ErrorState"

const StudentDatabasePage = () => {
  const { students, loading, error, fetchStudents, addStudent, editStudent, removeStudent } = useStudentData()
  const filters = useStudentFilters(students)
  const pagination = usePagination(filters.filteredStudents)

  const [view, setView] = useState("table") // "table" | "card"
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const handleView = (student) => {
    setSelectedStudent(student)
    setShowProfile(true)
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setShowProfile(false)
    setShowEditForm(true)
  }

  const handleDelete = (student) => {
    setSelectedStudent(student)
    setShowDeleteModal(true)
  }

  const handleAddSubmit = async (data) => {
    setFormLoading(true)
    const res = await addStudent(data)
    setFormLoading(false)
    if (res && !res.success) {
      alert("Error: " + (res.message || "Failed to add student"))
    } else {
      setShowAddForm(false)
    }
  }

  const handleEditSubmit = async (data) => {
    setFormLoading(true)
    await editStudent(selectedStudent.id, data)
    setFormLoading(false)
    setShowEditForm(false)
  }

  const handleDeleteConfirm = async () => {
    await removeStudent(selectedStudent.id)
    setShowDeleteModal(false)
  }

  if (loading) return <LoadingSpinner message="Loading students..." />
  if (error) return <ErrorState message={error} onRetry={fetchStudents} />

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Database</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage and track all student records</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 cursor-pointer"
        >
          <span className="text-lg">+</span> Add Student
        </button>
      </div>

      {/* Stats */}
      <StudentStatisticsCard students={students} />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <SearchStudent value={filters.search} onChange={filters.setSearch} />
          <DepartmentFilter value={filters.department} onChange={filters.setDepartment} />
          <CourseFilter value={filters.course} onChange={filters.setCourse} />
          <BatchFilter value={filters.batch} onChange={filters.setBatch} />
          <StatusFilter value={filters.placementStatus} onChange={filters.setPlacementStatus} />

          {/* Semester filter inline */}
          <select
            value={filters.semester}
            onChange={(e) => filters.setSemester(e.target.value)}
            className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none text-gray-600 cursor-pointer"
          >
            {["All", "1", "2", "3", "4", "5", "6", "7", "8"].map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Semesters" : `Sem ${s}`}</option>
            ))}
          </select>

          {/* Reset filters */}
          <button
            onClick={filters.resetFilters}
            className="h-10 px-4 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            Reset
          </button>

          {/* View toggle */}
          <div className="ml-auto flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${view === "table" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
            >
              Table
            </button>
            <button
              onClick={() => setView("card")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${view === "card" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        Showing {filters.filteredStudents.length} of {students.length} students
      </p>

      {/* Table or Card view */}
      {view === "table" ? (
        <StudentTable
          students={pagination.paginatedData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pagination.paginatedData.map((s) => (
            <StudentCard
              key={s.id}
              student={s}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <StudentPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={pagination.goToPage}
        onPageSizeChange={pagination.handlePageSizeChange}
      />

      {/* Modals */}
      {showProfile && selectedStudent && (
        <StudentProfilePreview
          student={selectedStudent}
          onClose={() => setShowProfile(false)}
          onEdit={() => handleEdit(selectedStudent)}
        />
      )}

      {showAddForm && (
        <StudentForm
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
          loading={formLoading}
        />
      )}

      {showEditForm && selectedStudent && (
        <EditStudentForm
          student={selectedStudent}
          onSubmit={handleEditSubmit}
          onCancel={() => setShowEditForm(false)}
          loading={formLoading}
        />
      )}

      {showDeleteModal && selectedStudent && (
        <DeleteStudentModal
          student={selectedStudent}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default StudentDatabasePage