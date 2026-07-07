import { useEffect, useState } from "react";

import {
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
} from "../services/companyJobPostingService";

const useJobPosting = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const data = await getJobPostings();
      setJobs([...data]);
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
      const newJob = await createJobPosting(job);

      setJobs((prev) => [...prev, newJob]);
    } catch {
      setError("Unable to add job.");
    }
  };

  const editJob = async (id, updatedJob) => {
    try {
      const job = await updateJobPosting(id, updatedJob);

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
    const selectedJob = jobs.find((job) => job.id === id);

    if (!selectedJob) return;

    const updatedStatus =
      selectedJob.status === "Open" ? "Closed" : "Open";

    const updatedJob = await updateJobPosting(id, {
      status: updatedStatus,
    });

    setJobs((prev) =>
      prev.map((job) => (job.id === id ? updatedJob : job))
    );
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