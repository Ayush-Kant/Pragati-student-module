import {
  companies,
  jobPostings,
} from "../types/companyJobPostingDummyData";

let companyData = [...companies];
let jobData = [...jobPostings];

// ---------------- Company ----------------

export const getCompanies = async () => {
  return [...companyData];
};

export const getCompanyById = async (id) => {
  return companyData.find((company) => company.id === id);
};

export const createCompany = async (company) => {
  const newCompany = {
    ...company,
    id: Date.now(),
  };

  companyData.push(newCompany);

  return newCompany;
};

export const updateCompany = async (id, updatedCompany) => {
  companyData = companyData.map((company) =>
    company.id === id ? { ...company, ...updatedCompany } : company
  );

  return companyData.find((company) => company.id === id);
};

export const deleteCompany = async (id) => {
  companyData = companyData.filter((company) => company.id !== id);

  return true;
};

// ---------------- Job ----------------

export const getJobPostings = async () => {
  return [...jobData];
};

export const createJobPosting = async (job) => {
  const newJob = {
    ...job,
    id: Date.now(),
  };

  jobData.push(newJob);

  return newJob;
};

export const updateJobPosting = async (id, updatedJob) => {
  jobData = jobData.map((job) =>
    job.id === id ? { ...job, ...updatedJob } : job
  );

  return jobData.find((job) => job.id === id);
};

export const deleteJobPosting = async (id) => {
  jobData = jobData.filter((job) => job.id !== id);

  return true;
};