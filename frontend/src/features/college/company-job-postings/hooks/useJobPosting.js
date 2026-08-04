import { useEffect, useState } from "react";

import {
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  toggleJobStatus as toggleJobStatusAPI,
} from "../services/companyJobPostingService";

const useJobPosting = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
  try {
    const data = await getJobPostings();
    setJobs(data);
  } catch {
    setError("Unable to fetch jobs.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs();
    };
    loadJobs();
  }, []);

  const addJob = async (job) => {
  try {
    await createJobPosting(job);

    // Reload jobs from backend
    await fetchJobs();

  } catch {
    setError("Unable to add job.");
  }
};

  const editJob = async (id, updatedJob) => {
    try {
      const payload = {
  company_id: updatedJob.company_id,
  role: updatedJob.role,
  department: updatedJob.department,
  location: updatedJob.location,
  package: updatedJob.package,
  cgpa_limit: Number(updatedJob.cgpa),
  batch: updatedJob.batch,
  application_deadline: updatedJob.deadline,
  job_description: updatedJob.jobDescription,
  hiring_process: updatedJob.hiringProcess,
  status: updatedJob.status
};


const job = await updateJobPosting(id, payload);

      setJobs((prev) =>
        prev.map((item) => (item.id === id ? job : item))
      );
    } catch {
      setError("Unable to update job.");
    }
  };

  const removeJob = async (id) => {
    try {
      await deleteJobPosting(id);

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch {
      setError("Unable to delete job.");
    }
  };

  const toggleJobStatus = async (id) => {

  try {

    const selectedJob = jobs.find(
      (job) => job.id === id
    );


    if (!selectedJob) return;


    const updatedJob = await toggleJobStatusAPI(
      id,
      selectedJob.status
    );


    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? updatedJob
          : job
      )
    );


  } catch (error) {

    console.error(
      "Toggle Status Error:",
      error
    );

    setError(
      "Unable to toggle job status."
    );

  }

};

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    addJob,
    editJob,
    removeJob,
    toggleJobStatus,
  };
};

export default useJobPosting;