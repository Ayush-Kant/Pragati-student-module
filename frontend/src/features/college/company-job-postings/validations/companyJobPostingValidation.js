export const validateCompany = (data) => {
  const errors = {};

  if (!data.company.trim()) {
    errors.company = "Company name is required";
  }

  if (!data.location.trim()) {
    errors.location = "Location is required";
  }

  if (!data.package.trim()) {
    errors.package = "Package is required";
  }

  return errors;
};

export const validateJobPosting = (data) => {
  const errors = {};

  if (!data.role.trim()) {
    errors.role = "Job role is required";
  }

  if (!data.company.trim()) {
    errors.company = "Company is required";
  }

  if (!data.cgpa) {
    errors.cgpa = "CGPA is required";
  }

  if (!data.batch.trim()) {
    errors.batch = "Batch is required";
  }

  if (!data.deadline) {
    errors.deadline = "Deadline is required";
  }

  return errors;
};