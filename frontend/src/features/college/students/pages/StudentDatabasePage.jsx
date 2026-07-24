import { useState } from "react"
import { useOutletContext } from "react-router-dom"
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
  const { darkMode } = useOutletContext()
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
    await addStudent(data)
    setFormLoading(false)
    setShowAddForm(false)
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

  if (loading) return <LoadingSpinner message="Loading students..." darkMode={darkMode} />
  if (error) return <ErrorState message={error} onRetry={fetchStudents} darkMode={darkMode} />

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Student Database</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Manage and track all student records</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#ff6d34] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#e85d2b] cursor-pointer"
        >
          <span className="text-lg">+</span> Add Student
        </button>
      </div>

      {/* Stats */}
      <StudentStatisticsCard students={students} darkMode={darkMode} />

      {/* Filters */}
      <div className={`rounded-2xl p-4 mb-4 ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-100'}`}>
        <div className="flex flex-wrap gap-3 items-center">
          <SearchStudent value={filters.search} onChange={filters.setSearch} darkMode={darkMode} />
          <DepartmentFilter value={filters.department} onChange={filters.setDepartment} darkMode={darkMode} />
          <CourseFilter value={filters.course} onChange={filters.setCourse} darkMode={darkMode} />
          <BatchFilter value={filters.batch} onChange={filters.setBatch} darkMode={darkMode} />
          <StatusFilter value={filters.placementStatus} onChange={filters.setPlacementStatus} darkMode={darkMode} />

          {/* Semester filter inline */}
          <select
            value={filters.semester}
            onChange={(e) => filters.setSemester(e.target.value)}
            className={`h-10 px-3 rounded-xl text-sm outline-none cursor-pointer ${
              darkMode ? 'bg-[#1A1A1A] border border-[#3D3D3D] text-gray-300 focus:border-[#ff6d34]' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {["All", "1", "2", "3", "4", "5", "6", "7", "8"].map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Semesters" : `Sem ${s}`}</option>
            ))}
          </select>

          {/* Reset filters */}
          <button
            onClick={filters.resetFilters}
            className={`h-10 px-4 text-sm rounded-xl cursor-pointer ${
              darkMode ? 'text-gray-400 border border-[#3D3D3D] hover:bg-[#3D3D3D]' : 'text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Reset
          </button>

          {/* View toggle */}
          <div className={`ml-auto flex rounded-xl p-1 gap-1 ${darkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`}>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                view === "table"
                  ? darkMode ? 'bg-[#2D2D2D] text-[#ff6d34] shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setView("card")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                view === "card"
                  ? darkMode ? 'bg-[#2D2D2D] text-[#ff6d34] shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className={`text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Showing {filters.filteredStudents.length} of {students.length} students
      </p>

      {/* Table or Card view */}
      {view === "table" ? (
        <StudentTable
          students={pagination.paginatedData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          darkMode={darkMode}
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
              darkMode={darkMode}
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
        darkMode={darkMode}
      />

      {/* Modals */}
      {showProfile && selectedStudent && (
        <StudentProfilePreview
          student={selectedStudent}
          onClose={() => setShowProfile(false)}
          onEdit={() => handleEdit(selectedStudent)}
          darkMode={darkMode}
        />
      )}

      {showAddForm && (
        <StudentForm
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
          loading={formLoading}
          darkMode={darkMode}
        />
      )}

      {showEditForm && selectedStudent && (
        <EditStudentForm
          student={selectedStudent}
          onSubmit={handleEditSubmit}
          onCancel={() => setShowEditForm(false)}
          loading={formLoading}
          darkMode={darkMode}
        />
      )}

      {showDeleteModal && selectedStudent && (
        <DeleteStudentModal
          student={selectedStudent}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

export default StudentDatabasePage