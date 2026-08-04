
import api from "../../../../services/api";


// ---------------- Company ----------------

export const getCompanies = async () => {
  const res = await api.get("/college/companies");
  return res.data.data;
};

export const getCompanyById = async (id) => {
  const res = await api.get(`/college/companies/${id}`);
  return res.data.data;
};

export const createCompany = async (company) => {
  const res = await api.post("/college/companies", company);
  return res.data.data;
};

export const updateCompany = async (id, company) => {
  const res = await api.put(`/college/companies/${id}`, company);
  return res.data.data;
};

export const deleteCompany = async (id) => {
  await api.delete(`/college/companies/${id}`);
  return true;
};

// ---------------- Job Postings ----------------

export const getJobPostings = async () => {
  const res = await api.get("/college/postings");
  return res.data.data;
};


export const createJobPosting = async (job) => {
  const res = await api.post("/college/postings", job);
  return res.data.data;
};


export const updateJobPosting = async (id, job) => {

  const payload = {
    role: job.role,
    department: job.department,
    location: job.location,
    package: job.package,

    cgpa_limit: Number(job.cgpa_limit ?? job.cgpa),

    batch: job.batch,

    application_deadline:
      job.application_deadline ?? job.deadline,

    job_description:
      job.job_description ?? job.jobDescription,

    hiring_process:
      job.hiring_process ?? job.hiringProcess,

    status: job.status
  };


  const res = await api.put(
    `/college/postings/${id}`,
    payload
  );

  return res.data.data;
};


export const deleteJobPosting = async (id) => {
  await api.delete(`/college/postings/${id}`);
  return true;
};


// ---------------- Job Status Toggle ----------------

export const toggleJobStatus = async (id, currentStatus) => {

  let res;

  if (currentStatus === "Open") {

    res = await api.patch(
      `/college/postings/${id}/close`
    );

  } else {

    res = await api.patch(
      `/college/postings/${id}/publish`
    );

  }

  return res.data.data;
};