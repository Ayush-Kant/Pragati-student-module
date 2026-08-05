import { useEffect, useMemo, useState } from "react";

import {
  getDepartments,
  getCourses,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../services/departmentService";
import { DEFAULT_FILTER } from "../constants/departmentConstants";

import {
  searchDepartments,
  filterDepartments,
} from "../utils/departmentHelpers";
 
import {
  updateDepartmentStatistics,
} from "../services/departmentStatisticsService";

export const useDepartmentData = () => {
  // ================= Data =================

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= Search & Filter =================

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  // ================= Department States =================

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [departmentToDelete, setDepartmentToDelete] =
    useState(null);

  // ================= Course States =================

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [courseToDelete, setCourseToDelete] =
    useState(null);

  // ================= Modal States =================

  const [showDepartmentForm, setShowDepartmentForm] =
    useState(false);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showCourseModal, setShowCourseModal] =
    useState(false);

  const [showCourseDeleteModal, setShowCourseDeleteModal] =
    useState(false);

  // ================= Load Data =================

  const loadData = async () => {
  try {
    setLoading(true);

    const departmentResponse = await getDepartments();
    const courseResponse = await getCourses();

   setDepartments(departmentResponse.data || departmentResponse);
   setCourses(courseResponse.data || courseResponse);
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadData();
}, []);

  // ================= Filtered Departments =================

  const filteredDepartments = useMemo(() => {
    const searchedDepartments =
      searchDepartments(
        departments,
        search
      );

    return filterDepartments(
      searchedDepartments,
      filter
    );
  }, [
    departments,
    search,
    filter,
  ]);

  // ================= Department View =================

  const handleViewDepartment = (
    department
  ) => {
    setSelectedDepartment(department);
  };

  const handleCloseDepartment = () => {
    setSelectedDepartment(null);
  };

  // ================= Department Form =================

  const openDepartmentForm = () => {
    setShowDepartmentForm(true);
  };

  const closeDepartmentForm = () => {
    setShowDepartmentForm(false);
  };

  // ================= Edit Department =================

  const openEditDepartment = (
    department
  ) => {
    setSelectedDepartment(department);
    setShowEditForm(true);
  };

  const closeEditDepartment = () => {
    setShowEditForm(false);
    setSelectedDepartment(null);
  };

  // ================= Delete Department =================

  const openDeleteDepartment = (
    department
  ) => {
    setSelectedDepartment(null);
    setDepartmentToDelete(department);
    setShowDeleteModal(true);
  };

  const closeDeleteDepartment = () => {
    setShowDeleteModal(false);
    setDepartmentToDelete(null);
    setSelectedDepartment(null);
  };

  // ================= Course View =================

  const handleViewCourse = (
    course
  ) => {
    setSelectedCourse(course);
  };

  const closeCourseView = () => {
    setSelectedCourse(null);
  };

  // ================= Course Form =================

  const openCourseForm = (
    course = null
  ) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const closeCourseForm = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  // ================= Course Delete =================

  const openCourseDelete = (
    course
  ) => {
    setCourseToDelete(course);
    setShowCourseDeleteModal(true);
  };

  const closeCourseDelete = () => {
    setShowCourseDeleteModal(false);
    setCourseToDelete(null);
  };

  // ================= Department CRUD =================
    const handleAddDepartment = async (data) => {
  try {
    await addDepartment(data);

    await loadData();

    closeDepartmentForm();
  } catch (error) {
    console.error("Error adding department:", error);
  }
};

const handleEditDepartment = async (data) => {
  try {
    await updateDepartment(selectedDepartment.id, {
      name: data.name,
      code: data.code,
      hod: data.hod,
      description: data.description,
    });

    if (data.totalStudents !== undefined && data.totalStudents !== "" && !Number.isNaN(Number(data.totalStudents))) {
    await updateDepartmentStatistics({
      departmentId: selectedDepartment.id,
      totalStudents: Number(data.totalStudents),
    });
}
    await loadData();

    closeEditDepartment();
  } catch (error) {
    console.error("Error updating department:", error);
  }
};

const handleDeleteDepartment = async () => {
  if (!departmentToDelete) return;

  try {
    await deleteDepartment(departmentToDelete.id);

    await loadData();

    closeDeleteDepartment();
  } catch (error) {
    console.error("Error deleting department:", error);
  }
};

  // ================= Course CRUD =================

  const handleCourseSubmit = async (data) => {
  try {
    if (selectedCourse) {
      await updateCourse(selectedCourse.id, data);
    } else {
      await addCourse(data);
    }

    await loadData();

    closeCourseForm();
  } catch (error) {
    console.error("Error saving course:", error);
  }
};

const handleDeleteCourse = async () => {
  if (!courseToDelete) return;

  try {
    await deleteCourse(courseToDelete.id);

    await loadData();

    closeCourseDelete();
  } catch (error) {
    console.error("Error deleting course:", error);
  }
};

  // ================= Return =================

  return {
    // Data
    departments,
    filteredDepartments,
    courses,
    loading,

    // Search
    search,
    setSearch,

    // Filter
    filter,
    setFilter,

    // Department Selection
    selectedDepartment,
    departmentToDelete,

    // Course Selection
    selectedCourse,
    courseToDelete,

    // Department Modals
    showDepartmentForm,
    showEditForm,
    showDeleteModal,

    // Course Modals
    showCourseModal,
    showCourseDeleteModal,

    // Department Actions
    handleViewDepartment,
    handleCloseDepartment,

    openDepartmentForm,
    closeDepartmentForm,

    openEditDepartment,
    closeEditDepartment,

    openDeleteDepartment,
    closeDeleteDepartment,

    // Course Actions
    handleViewCourse,
    closeCourseView,

    openCourseForm,
    closeCourseForm,

    openCourseDelete,
    closeCourseDelete,

    // CRUD
    handleAddDepartment,
    handleEditDepartment,
    handleDeleteDepartment,

    handleCourseSubmit,
    handleDeleteCourse,

    reload: loadData,
  };
};