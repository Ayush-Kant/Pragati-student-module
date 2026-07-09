export const searchDepartments = (departments, searchTerm) => {
  if (!searchTerm) return departments;

  return departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.hod.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const filterDepartments = (departments, filter) => {
  if (!filter || filter === "ALL") return departments;

  return departments.filter(
    (department) => department.code === filter
  );
};

export const calculateTotalStudents = (departments) => {
  return departments.reduce(
    (total, department) => total + department.totalStudents,
    0
  );
};

export const calculateTotalCourses = (departments) => {
  return departments.reduce(
    (total, department) => total + department.totalCourses,
    0
  );
};