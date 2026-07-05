import { useMemo } from "react";

const useJobFilters = ({
  companies = [],
  jobs = [],
  search = "",
  company = "",
  department = "",
  batch = "",
  status = "",
}) => {
  const filteredCompanies = useMemo(() => {
    return companies.filter((item) =>
      item.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, search]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCompany =
        !company || job.company === company;

      const matchesDepartment =
        !department || job.department === department;

      const matchesBatch =
        !batch || job.batch === batch;

      const matchesStatus =
        !status || job.status === status;

      return (
        matchesCompany &&
        matchesDepartment &&
        matchesBatch &&
        matchesStatus
      );
    });
  }, [jobs, company, department, batch, status]);

  return {
    filteredCompanies,
    filteredJobs,
  };
};

export default useJobFilters;