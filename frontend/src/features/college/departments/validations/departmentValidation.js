export const validateDepartment = (values) => {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = "Department name is required.";
  }

  if (!values.code?.trim()) {
    errors.code = "Department code is required.";
  }

  if (!values.hod?.trim()) {
    errors.hod = "HOD name is required.";
  }

  if (
    values.totalStudents === "" ||
    Number(values.totalStudents) < 0
  ) {
    errors.totalStudents = "Enter a valid student count.";
  }

  if (
    values.totalCourses === "" ||
    Number(values.totalCourses) < 0
  ) {
    errors.totalCourses = "Enter a valid course count.";
  }

  return errors;
};