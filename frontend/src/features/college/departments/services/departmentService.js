import {
  departmentList,
  courseList,
} from "../types/departmentDummyData";

// ================= Departments =================

export const getDepartments = async () => {
  return Promise.resolve([...departmentList]);
};

export const addDepartment = async (departments, newDepartment) => {
  return Promise.resolve([
    ...departments,
    {
      id: Date.now(),
      ...newDepartment,
    },
  ]);
};

export const updateDepartment = async (
  departments,
  updatedDepartment
) => {
  return Promise.resolve(
    departments.map((department) =>
      department.id === updatedDepartment.id
        ? {
            ...department,
            ...updatedDepartment,
          }
        : department
    )
  );
};

export const deleteDepartment = async (
  departments,
  departmentId
) => {
  return Promise.resolve(
    departments.filter(
      (department) => department.id !== departmentId
    )
  );
};

// ================= Courses =================

export const getCourses = async () => {
  return Promise.resolve([...courseList]);
};

export const addCourse = async (courses, newCourse) => {
  return Promise.resolve([
    ...courses,
    {
      id: Date.now(),
      ...newCourse,
    },
  ]);
};

export const updateCourse = async (
  courses,
  updatedCourse
) => {
  return Promise.resolve(
    courses.map((course) =>
      course.id === updatedCourse.id
        ? {
            ...course,
            ...updatedCourse,
          }
        : course
    )
  );
};

export const deleteCourse = async (
  courses,
  courseId
) => {
  return Promise.resolve(
    courses.filter(
      (course) => course.id !== courseId
    )
  );
};

/*
Future Backend Integration

export const getDepartments = () => axios.get("/departments");
export const addDepartment = (data) => axios.post("/departments", data);
export const updateDepartment = (id, data) => axios.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => axios.delete(`/departments/${id}`);

export const getCourses = () => axios.get("/courses");
export const addCourse = (data) => axios.post("/courses", data);
export const updateCourse = (id, data) => axios.put(`/courses/${id}`, data);
export const deleteCourse = (id) => axios.delete(`/courses/${id}`);
*/