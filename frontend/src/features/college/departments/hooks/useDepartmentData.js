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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const departmentData =
        await getDepartments();

      const courseData =
        await getCourses();

      setDepartments(departmentData);
      setCourses(courseData);
    } finally {
      setLoading(false);
    }
  };

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
    const updatedDepartments =
      await addDepartment(
        departments,
        data
      );

    setDepartments(updatedDepartments);

    closeDepartmentForm();
  };

  const handleEditDepartment = async (data) => {
    const updatedDepartments =
      await updateDepartment(
        departments,
        data
      );

    setDepartments(updatedDepartments);

    closeEditDepartment();
  };

  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return;

    const updatedDepartments =
      await deleteDepartment(
        departments,
        departmentToDelete.id
      );

    setDepartments(updatedDepartments);

    closeDeleteDepartment();
  };

  // ================= Course CRUD =================

  const handleCourseSubmit = async (
    data
  ) => {
    let updatedCourses;

    if (selectedCourse) {
      updatedCourses =
        await updateCourse(
          courses,
          {
            ...data,
            id: selectedCourse.id,
          }
        );
    } else {
      updatedCourses =
        await addCourse(
          courses,
          data
        );
    }

    setCourses(updatedCourses);

    closeCourseForm();
  };

  const handleDeleteCourse =
    async () => {
      if (!courseToDelete)
        return;

      const updatedCourses =
        await deleteCourse(
          courses,
          courseToDelete.id
        );

      setCourses(updatedCourses);

      closeCourseDelete();
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