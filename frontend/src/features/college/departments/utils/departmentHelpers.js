export const searchDepartments = (
  departments,
  searchTerm
) => {
  if (!searchTerm) return departments;

  const search = searchTerm.toLowerCase();

  return departments.filter(
    (department) =>
      department.name.toLowerCase().includes(search) ||
      department.code.toLowerCase().includes(search) ||
      department.hod.toLowerCase().includes(search)
  );
};
export const searchCourses = (
  courses,
  search
) => {
  const searchValue =
    search.toLowerCase();

  return courses.filter(
    (course) =>
      course.name
        .toLowerCase()
        .includes(searchValue) ||
      course.code
        .toLowerCase()
        .includes(searchValue)
  );
};

export const filterDepartments = (
  departments,
  filter
) => {
  if (!filter || filter === "ALL") {
    return departments;
  }

  return departments.filter(
    (department) => department.code === filter
  );
};

export const calculateTotalStudents = (
  departments
) => {
  return departments.reduce(
    (total, department) =>
      total + department.totalStudents,
    0
  );
};

export const calculateTotalCourses = (
  departments
) => {
  return departments.reduce(
    (total, department) =>
      total + department.totalCourses,
    0
  );
};