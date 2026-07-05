export const validateCompany = (company) => {
  if (!company.company.trim()) {
    return "Company Name is required";
  }

  if (!company.location.trim()) {
    return "Location is required";
  }

  if (!company.package.trim()) {
    return "Package is required";
  }

  return "";
};

export const validateJobPosting = (job) => {
  if (!job.role.trim()) {
    return "Job Role is required";
  }

  if (!job.company.trim()) {
    return "Company Name is required";
  }

  if (!job.cgpa) {
    return "CGPA is required";
  }

  if (!job.batch.trim()) {
    return "Batch is required";
  }

  if (!job.deadline) {
    return "Deadline is required";
  }

  return "";
};

export const validateEligibility = () => {
  return "";
};