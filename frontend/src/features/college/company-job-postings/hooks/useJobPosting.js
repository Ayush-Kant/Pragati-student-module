// import { useEffect, useState } from "react";

// import {
//   getJobPostings,
//   createJobPosting,
//   updateJobPosting,
//   deleteJobPosting,
// } from "../services/companyJobPostingService";

// const useJobPosting = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const data = await getJobPostings();
//       setJobs(data);
//     } catch (err) {
//       setError("Unable to fetch jobs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const addJob = async (job) => {
//     await createJobPosting(job);
//     fetchJobs();
//   };

//   const editJob = async (id, job) => {
//     await updateJobPosting(id, job);
//     fetchJobs();
//   };

//   const removeJob = async (id) => {
//     await deleteJobPosting(id);
//     fetchJobs();
//   };

//   const toggleJobStatus = async (id) => {
//     const selectedJob = jobs.find((job) => job.id === id);

//     if (!selectedJob) return;

//     const updatedStatus =
//       selectedJob.status === "Open" ? "Closed" : "Open";

//     await updateJobPosting(id, {
//       status: updatedStatus,
//     });

//     fetchJobs();
//   };

//   return {
//     jobs,
//     loading,
//     error,
//     fetchJobs,
//     addJob,
//     editJob,
//     removeJob,
//     toggleJobStatus,
//   };
// };

// export default useJobPosting;

import { useState } from "react";

import {
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
} from "../services/companyJobPostingService";

const initialJobs = await getJobPostings();

const useJobPosting = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading] = useState(false);
  const [error] = useState("");

  const fetchJobs = async () => {
    const data = await getJobPostings();
    setJobs(data);
  };

  const addJob = async (job) => {
    await createJobPosting(job);
    await fetchJobs();
  };

  const editJob = async (id, job) => {
    await updateJobPosting(id, job);
    await fetchJobs();
  };

  const removeJob = async (id) => {
    await deleteJobPosting(id);
    await fetchJobs();
  };

  const toggleJobStatus = async (id) => {
    const selectedJob = jobs.find((job) => job.id === id);

    if (!selectedJob) return;

    const updatedStatus =
      selectedJob.status === "Open" ? "Closed" : "Open";

    await updateJobPosting(id, {
      status: updatedStatus,
    });

    await fetchJobs();
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