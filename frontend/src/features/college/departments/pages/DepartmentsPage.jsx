import { useMemo, useState } from "react";

import {
  departmentList,
  courseList,
} from "../types/departmentDummyData";

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

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState(departmentList);
  const [courses, setCourses] = useState(courseList);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [loading] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [showCourseDeleteModal, setShowCourseDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  const [showDepartmentForm, setShowDepartmentForm] =
    useState(false);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showCourseModal, setShowCourseModal] =
    useState(false);

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      const matchesSearch =
        department.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        department.code
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        department.hod
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "" || department.code === filter;

      return matchesSearch && matchesFilter;
    });
  }, [departments, search, filter]);

  const handleAddDepartment = (data) => {
  const newDepartment = {
    id: Date.now(),
    ...data,
  };

  setDepartments((prevDepartments) => [
    ...prevDepartments,
    newDepartment,
  ]);

  setShowDepartmentForm(false);
};
  const handleEditDepartment = (data) => {
  setDepartments((prevDepartments) =>
    prevDepartments.map((department) =>
      department.id === data.id
        ? {
            ...department,
            ...data,
          }
        : department
    )
  );

  setShowEditForm(false);
  setSelectedDepartment(null);
};

  const handleDeleteDepartment = () => {
  setDepartments((prevDepartments) =>
    prevDepartments.filter(
      (department) => department.id !== departmentToDelete.id
    )
  );

  setShowDeleteModal(false);
  setDepartmentToDelete(null);
  setSelectedDepartment(null);
};

 const handleCourseSubmit = (data) => {
  if (selectedCourse) {
    // Edit Course
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              ...data,
              id: selectedCourse.id,
            }
          : course
      )
    );
  } else {
    // Add Course
    const newCourse = {
      id: Date.now(),
      ...data,
    };

    setCourses((prevCourses) => [
      ...prevCourses,
      newCourse,
    ]);
  }

  setShowCourseModal(false);
  setSelectedCourse(null);
};
  const handleDeleteCourse = () => {
  setCourses((prevCourses) =>
    prevCourses.filter(
      (course) => course.id !== courseToDelete.id
    )
  );

  setShowCourseDeleteModal(false);
  setCourseToDelete(null);
};
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Manage Departments
          </h1>

          <p className="text-gray-500 mt-1">
            Manage departments and courses
          </p>

        </div>

        <button
          onClick={() => setShowDepartmentForm(true)}
          className="mt-4 md:mt-0 bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Department
        </button>

      </div>

      {/* Overview */}

      <DepartmentOverview
        departments={departments}
      />

      {/* Search & Filter */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">

        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search Department..."
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

          {/* Desktop Table */}

          <DepartmentTable
            departments={filteredDepartments}
            onView={(department) => {
 
            setSelectedDepartment(department);
            }}
            onEdit={(department) => {
              setSelectedDepartment(department);
              setShowEditForm(true);
            }}
            onDelete={(department) => {
            setSelectedDepartment(null);
            setDepartmentToDelete(department);
            setShowDeleteModal(true);
            }}
          />

          {/* Mobile Grid */}

          <DepartmentGrid
          departments={filteredDepartments}
          onView={(department) => {
          setSelectedDepartment(department);
          }}

          onEdit={(department) => {
          setSelectedDepartment(department);
          setShowEditForm(true);
          }}
          onDelete={(department) => {
          setSelectedDepartment(null);
          setDepartmentToDelete(department);
          setShowDeleteModal(true);
          }}
          />

        </>
      )}

      {/* Department Details */}

     {selectedDepartment &&
     !showDeleteModal &&
     !showEditForm && (
    <DepartmentDetails
    department={selectedDepartment}
    onClose={() => setSelectedDepartment(null)}
  />
)}

      {/* Courses Section */}

      <div className="mt-14">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Courses
            </h2>

            <p className="text-gray-500 mt-1">
              Department course management
            </p>

          </div>

          <button
            onClick={() =>
              setShowCourseModal(true)
            }
            className="mt-4 md:mt-0 bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-3 rounded-lg font-semibold transition"
          >
            + Add Course
          </button>

        </div>

        <CourseOverview
          courses={courses}
        />

        <CourseTable
        courses={courses}
         onView={(course) => {
         setSelectedCourse(course);
         }}
         onEdit={(course) => {
         setSelectedCourse(course);
         setShowCourseModal(true);
          }}
         onDelete={(course) => {
         setCourseToDelete(course);
         setShowCourseDeleteModal(true);
         }}
        />

      </div>

      {/* Add Department */}

      {showDepartmentForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl w-full max-w-3xl">

            <DepartmentForm
              onSubmit={handleAddDepartment}
              onCancel={() =>
                setShowDepartmentForm(false)
              }
            />

          </div>

        </div>
      )}

      {/* Edit Department */}

      {showEditForm && selectedDepartment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl w-full max-w-3xl">

            <EditDepartmentForm
              department={selectedDepartment}
              onSubmit={handleEditDepartment}
              onCancel={() => {
              setShowEditForm(false);
              setSelectedDepartment(null);
              }
              }
            />

          </div>

        </div>
      )}
            {/* Delete Department */}

      <DeleteDepartmentModal
       isOpen={showDeleteModal}
       department={departmentToDelete}
       onConfirm={handleDeleteDepartment}
       onCancel={() => {
       setShowDeleteModal(false);
       setDepartmentToDelete(null);
       setSelectedDepartment(null);
       }}
      />

      {/* Course Modal */}

      <CourseModal
       isOpen={showCourseModal}
       course={selectedCourse}
       onSubmit={handleCourseSubmit}
       onClose={() => {
       setShowCourseModal(false);
       setSelectedCourse(null);
        }}
      />
    {selectedCourse &&
     !showCourseModal &&
     !showCourseDeleteModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg w-[95%] max-w-2xl">

      {/* Header */}
      <div className="flex justify-between items-center border-b px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Course Details
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Complete course information
          </p>
        </div>

        <button
          onClick={() => setSelectedCourse(null)}
          className="text-2xl text-gray-500 hover:text-red-500"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">
            Course Name
          </p>
          <p className="font-semibold">
            {selectedCourse.courseName}
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">
            Course Code
          </p>
          <p className="font-semibold">
            {selectedCourse.courseCode}
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">
            Semester
          </p>
          <p className="font-semibold">
            {selectedCourse.semester}
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">
            Credits
          </p>
          <p className="font-semibold">
            {selectedCourse.credits}
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-end border-t px-6 py-4">
        <button
          onClick={() => setSelectedCourse(null)}
          className="px-6 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
  {showCourseDeleteModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
      <h2 className="text-xl font-semibold mb-3">
        Delete Course
      </h2>

      <p className="text-gray-600">
        Are you sure you want to delete{" "}
        <strong>{courseToDelete?.courseName}</strong>?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setShowCourseDeleteModal(false);
            setCourseToDelete(null);
          }}
          className="border px-4 py-2 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteCourse}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default DepartmentsPage;