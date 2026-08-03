export const validateCompany = (
  data,
  existingCompanies = [],
  editingCompanyId = null
) => {

  const errors = {};

  const companyName = (data.name || "").trim();

  if (!companyName) {
    errors.name = "Company name is required";
  }
  else if (companyName.length < 2) {
    errors.name = "Company name must be at least 2 characters";
  }
  else {

    const normalizedNewName =
      companyName
        .toLowerCase()
        .replace(/\s+/g, " ");


    const isDuplicate = existingCompanies.some(
      (company) =>
        (company.name || "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ") === normalizedNewName
          &&
        company.id !== editingCompanyId
    );


    if(isDuplicate){
      errors.name = "Company name already exists";
    }

  }


  const location = (data.location || "").trim();

  if(!location){
    errors.location="Location is required";
  }


  const pkg = (data.package || "").trim();

  if(!pkg){

    errors.package="Package is required";

  }
  else{

    const packageRegex =
      /^(\d+(\.\d+)?)\s*(LPA)?$/i;


    if(!packageRegex.test(pkg)){

      errors.package =
      "Package must be like 8 LPA or 8";

    }

  }


  return errors;

};   // <-- VERY IMPORTANT


// New export starts only after closing above function

export const validateEligibility = (data)=>{

 const errors={};

 const cgpaVal=parseFloat(data.cgpa);

 if(!data.cgpa || isNaN(cgpaVal)){
    errors.cgpa="CGPA must be a valid number";
 }
 else if(cgpaVal < 0 || cgpaVal > 10){
    errors.cgpa="CGPA must be between 0 and 10";
 }


 const batch=(data.batch || "").trim();

 if(!batch){
    errors.batch="Batch is required";
 }


 return errors;

};

export const validateJobPosting = (data, existingJobs = [], editingJobId = null) => {
  const errors = {};

  const role = (data.role || "").trim();
  if (!role) {
    errors.role = "Job role is required";
  }

  const company = (data.company || "").trim();
  if (!company) {
    errors.company = "Company is required";
  }

  const location = (data.location || "").trim();
  if (!location) {
    errors.location = "Location is required";
  } else if (location.length < 2) {
    errors.location = "Location must be at least 2 characters";
  } else if (!/^[a-zA-Z0-9\s,\-.]+$/.test(location)) {
    errors.location = "Location must contain only letters, numbers, spaces, commas, hyphens, or periods";
  }

  if (!data.deadline) {
    errors.deadline = "Deadline is required";
  } else {
    const deadlineDate = new Date(data.deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.deadline = "Deadline must be a valid date";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        errors.deadline = "Deadline must be a future date";
      }
    }
  }

  const department = (data.department || "").trim();
  if (!department) {
    errors.department = "Department is required";
  }

  const pkg = (data.package || "").trim();
  if (!pkg) {
    errors.package = "Package is required";
  } else {
    const packageRegex = /^(\d+(\.\d+)?)\s*(LPA)?$/i;
    const match = pkg.match(packageRegex);
    if (!match) {
      errors.package = "Package must be a valid number, optionally followed by 'LPA' (e.g., '12' or '12 LPA')";
    } else {
      const numericVal = parseFloat(match[1]);
      if (isNaN(numericVal) || numericVal <= 0) {
        errors.package = "Package must be a positive value";
      }
    }
  }

  const jobDescription = (data.jobDescription || "").trim();
  if (!jobDescription) {
    errors.jobDescription = "Job description is required";
  } else if (jobDescription.length < 10) {
    errors.jobDescription = "Job description must be at least 10 characters";
  }

  const hiringProcess = (data.hiringProcess || "").trim();
  if (!hiringProcess) {
    errors.hiringProcess = "Hiring process is required";
  }

  // Delegate eligibility validations (CGPA and Batch)
  const eligibilityErrors = validateEligibility(data);
  Object.assign(errors, eligibilityErrors);

  // Prevent duplicate job postings where applicable (same company, role, and batch)
  if (company && role && data.batch) {
    const isDuplicate = existingJobs.some(
      (j) =>
        j.company.trim().toLowerCase() === company.toLowerCase() &&
        j.role.trim().toLowerCase() === role.toLowerCase() &&
        j.batch.trim() === data.batch.trim() &&
        j.id !== editingJobId
    );
    if (isDuplicate) {
      errors.role = "A job posting with the same company, role, and batch already exists";
    }
  }

  return errors;
}
