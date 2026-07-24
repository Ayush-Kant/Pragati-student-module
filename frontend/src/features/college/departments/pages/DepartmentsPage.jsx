import { useDepartmentData } from "../hooks/useDepartmentData";

import DepartmentOverview from "../components/department/DepartmentOverview";
import DepartmentTable from "../components/department/DepartmentTable";
import DepartmentGrid from "../components/department/DepartmentGrid";
import DepartmentDetails from "../components/department/DepartmentDetails";
import DepartmentSkeleton from "../components/department/DepartmentSkeleton";

import CourseOverview from "../components/course/CourseOverview";
import CourseTable from "../components/course/CourseTable";
import CourseModal from "../components/course/CourseModal";

import DepartmentForm from "../components/forms/DepartmentForm";
import EditDepartmentForm from "../components/forms/EditDepartmentForm";
import DeleteDepartmentModal from "../components/forms/DeleteDepartmentModal";

import SearchFilter from "../components/filters/SearchFilter";
import DepartmentFilter from "../components/filters/DepartmentFilter";

import {
  SEARCH_PLACEHOLDER,
  DEPARTMENT_PAGE,
  COURSE_SECTION,
  COURSE_DETAILS,
  BUTTON_LABELS,
  DELETE_COURSE,
} from "../constants/departmentConstants";

const DepartmentsPage = () => {
  const {
    departments,
    filteredDepartments,
    courses,

    loading,

    search,
    setSearch,

    filter,
    setFilter,

    selectedDepartment,
    departmentToDelete,

    selectedCourse,
    courseToDelete,

    showDepartmentForm,
    showEditForm,
    showDeleteModal,

    showCourseModal,
    showCourseDeleteModal,

    handleViewDepartment,
    handleCloseDepartment,

    openDepartmentForm,
    closeDepartmentForm,

    openEditDepartment,
    closeEditDepartment,

    openDeleteDepartment,
    closeDeleteDepartment,

    handleViewCourse,
    closeCourseView,

    openCourseForm,
    closeCourseForm,

    openCourseDelete,
    closeCourseDelete,

    handleAddDepartment,
    handleEditDepartment,
    handleDeleteDepartment,

    handleCourseSubmit,
    handleDeleteCourse,
  } = useDepartmentData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
  {DEPARTMENT_PAGE.TITLE}
</h1>

<p className="text-gray-500 mt-1">
  {DEPARTMENT_PAGE.SUBTITLE}
</p>
        </div>

        <button
          onClick={openDepartmentForm}
          className="mt-4 md:mt-0 bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-3 rounded-lg font-semibold transition"
        >
         {DEPARTMENT_PAGE.ADD_BUTTON}
        </button>

      </div>

      {/* Overview */}

      <DepartmentOverview
        departments={departments}
      />

      {/* Search */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">

        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder={SEARCH_PLACEHOLDER}
        />

        <DepartmentFilter
          value={filter}
          onChange={setFilter}
          options={departments}
        />

      </div>

      {/* Loading */}

      {loading ? (
        <DepartmentSkeleton />
      ) : (
        <>

          {/* Desktop */}

          <DepartmentTable
            departments={filteredDepartments}
            onView={handleViewDepartment}
            onEdit={openEditDepartment}
            onDelete={openDeleteDepartment}
          />

          {/* Mobile */}

          <DepartmentGrid
            departments={filteredDepartments}
            onView={handleViewDepartment}
            onEdit={openEditDepartment}
            onDelete={openDeleteDepartment}
          />

        </>
      )}

            {/* Department Details */}

      {selectedDepartment &&
        !showDeleteModal &&
        !showEditForm && (
          <DepartmentDetails
            department={selectedDepartment}
            onClose={handleCloseDepartment}
          />
        )}

      {/* ================= Courses ================= */}

      <div className="mt-14">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
  {COURSE_SECTION.TITLE}
</h2>

<p className="text-gray-500 mt-1">
  {COURSE_SECTION.SUBTITLE}
</p>
          </div>

          <button
            onClick={() => openCourseForm()}
            className="mt-4 md:mt-0 bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-3 rounded-lg font-semibold transition"
          >
           {COURSE_SECTION.ADD_BUTTON}
          </button>

        </div>

        <CourseOverview
          courses={courses}
        />

        <CourseTable
          courses={courses}
          onView={handleViewCourse}
          onEdit={openCourseForm}
          onDelete={openCourseDelete}
        />

      </div>

      {/* ================= Course Details ================= */}

      {selectedCourse &&
        !showCourseModal &&
        !showCourseDeleteModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-lg w-[95%] max-w-2xl">

              {/* Header */}

              <div className="flex justify-between items-center border-b px-6 py-4">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
  {COURSE_DETAILS.TITLE}
</h2>

<p className="text-gray-500 text-sm mt-1">
  {COURSE_DETAILS.SUBTITLE}
</p>

                </div>

                <button
                  onClick={closeCourseView}
                  className="text-2xl text-gray-500 hover:text-red-500"
                >
                  x
                </button>

              </div>

              {/* Body */}

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="border rounded-lg p-4 bg-gray-50">

                  <p className="text-sm text-gray-500 mb-1">
                   {COURSE_DETAILS.NAME_LABEL}
                  </p>

                  <p className="font-semibold">
                    {selectedCourse.courseName}
                  </p>

                </div>

                <div className="border rounded-lg p-4 bg-gray-50">

                  <p className="text-sm text-gray-500 mb-1">
                   {COURSE_DETAILS.CODE_LABEL}
                  </p>

                  <p className="font-semibold">
                    {selectedCourse.courseCode}
                  </p>

                </div>

                <div className="border rounded-lg p-4 bg-gray-50">

                  <p className="text-sm text-gray-500 mb-1">
                   {COURSE_DETAILS.SEMESTER_LABEL}
                  </p>

                  <p className="font-semibold">
                    {selectedCourse.semester}
                  </p>

                </div>

                <div className="border rounded-lg p-4 bg-gray-50">

                  <p className="text-sm text-gray-500 mb-1">
                    {COURSE_DETAILS.CREDITS_LABEL}
                  </p>

                  <p className="font-semibold">
                    {selectedCourse.credits}
                  </p>

                </div>

              </div>

              {/* Footer */}

              <div className="flex justify-end border-t px-6 py-4">

                <button
                  onClick={closeCourseView}
                  className="px-6 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg"
                >
                  {BUTTON_LABELS.CLOSE}
                </button>

              </div>

            </div>

          </div>

        )}
              {/* ================= Add Department ================= */}

      {showDepartmentForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl w-full max-w-3xl">

            <DepartmentForm
              onSubmit={handleAddDepartment}
              onCancel={closeDepartmentForm}
            />

          </div>

        </div>
      )}

      {/* ================= Edit Department ================= */}

      {showEditForm && selectedDepartment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl w-full max-w-3xl">

            <EditDepartmentForm
              department={selectedDepartment}
              onSubmit={handleEditDepartment}
              onCancel={closeEditDepartment}
            />

          </div>

        </div>
      )}

      {/* ================= Delete Department ================= */}

      <DeleteDepartmentModal
        isOpen={showDeleteModal}
        department={departmentToDelete}
        onConfirm={handleDeleteDepartment}
        onCancel={closeDeleteDepartment}
      />

      {/* ================= Course Modal ================= */}

      <CourseModal
        isOpen={showCourseModal}
        course={selectedCourse}
        departments={departments}
        onSubmit={handleCourseSubmit}
        onClose={closeCourseForm}
      />

      {/* ================= Delete Course ================= */}

      {showCourseDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">

            <h2 className="text-xl font-semibold mb-3">
              {DELETE_COURSE.TITLE}
            </h2>

            <p className="text-gray-600">
              {DELETE_COURSE.MESSAGE}
              <strong>
                {courseToDelete?.courseName}
              </strong>
              ?
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={closeCourseDelete}
                className="border px-4 py-2 rounded-lg"
              >
                {BUTTON_LABELS.CANCEL}
              </button>

              <button
                onClick={handleDeleteCourse}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                {BUTTON_LABELS.DELETE}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DepartmentsPage;