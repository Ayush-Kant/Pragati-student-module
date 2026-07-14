import { useState } from "react";
import {
  Building2,
  BriefcaseBusiness,
  CircleCheckBig,
  CircleX,
} from "lucide-react";

import useCompanyData from "../hooks/useCompanyData";
import useJobPosting from "../hooks/useJobPosting";
import useJobFilters from "../hooks/useJobFilters";

import CompanyTable from "../components/company/CompanyTable";
import CompanyDetails from "../components/company/CompanyDetails";
import JobPostingTable from "../components/jobs/JobPostingTable";

import CompanyForm from "../components/forms/CompanyForm";
import JobPostingForm from "../components/forms/JobPostingForm";

import SearchCompany from "../components/filters/SearchCompany";
import CompanyFilter from "../components/filters/CompanyFilter";
import DepartmentFilter from "../components/filters/DepartmentFilter";
import BatchFilter from "../components/filters/BatchFilter";
import JobStatusFilter from "../components/filters/JobStatusFilter";

import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import ConfirmationModal from "../components/common/ConfirmationModal";
import DeleteJobPostingModal from "../components/forms/DeleteJobPostingModal";

const CompanyJobPostingsPage = () => {
  const {
    companies,
    loading: companyLoading,
    error: companyError,
    addCompany,
    editCompany,
    removeCompany,
  } = useCompanyData();

  const {
    jobs,
    loading: jobLoading,
    error: jobError,
    addJob,
    editJob,
    removeJob,
    toggleJobStatus,
  } = useJobPosting();

  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [status, setStatus] = useState("");

  const [editingJob, setEditingJob] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewCompany, setViewCompany] = useState(null);

  // States for confirmation modals
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Filtering consumed from hook
  const { filteredCompanies, filteredJobs } = useJobFilters({
    companies,
    jobs,
    search,
    company: selectedCompany,
    department,
    batch,
    status,
  });

  const openJobs = jobs.filter(
    (job) => job.status === "Open"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === "Closed"
  ).length;

  // ---------------- Company ----------------

  const handleEditCompany = (company) => {
    setEditingCompany(company);
  };

  const handleViewCompany = (company) => {
    setViewCompany(company);
  };

  const handleSubmitCompany = async (data) => {
    if (editingCompany) {
      await editCompany(editingCompany.id, data);
      setEditingCompany(null);
      // Update viewCompany if it's currently selected for viewing
      if (viewCompany?.id === editingCompany.id) {
        setViewCompany({ ...viewCompany, ...data });
      }
    } else {
      await addCompany(data);
    }
  };

  const handleDeleteCompanyClick = (id) => {
    setCompanyToDelete(id);
  };

  const handleConfirmDeleteCompany = async () => {
    if (companyToDelete) {
      await removeCompany(companyToDelete);
      if (viewCompany?.id === companyToDelete) {
        setViewCompany(null);
      }
      setCompanyToDelete(null);
    }
  };

  // ---------------- Job ----------------

  const handleEditJob = (job) => {
    setEditingJob(job);
  };

  const handleSubmitJob = async (data) => {
    if (editingJob) {
      await editJob(editingJob.id, data);
      setEditingJob(null);
    } else {
      await addJob(data);
    }
  };

  const handleDeleteJobClick = (id) => {
    setJobToDelete(id);
  };

  const handleConfirmDeleteJob = async () => {
    if (jobToDelete) {
      await removeJob(jobToDelete);
      setJobToDelete(null);
    }
  };

  if (companyLoading || jobLoading) {
    return <LoadingSpinner />;
  }

  if (companyError || jobError) {
    return (
      <ErrorState
        message={companyError || jobError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Company Job Postings
        </h1>

        <p className="text-slate-500">
          Placement Management Dashboard
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6 flex justify-between">
          <div>
            <p className="text-slate-500">Companies</p>
            <h2 className="text-3xl font-bold">
              {companies.length}
            </h2>
          </div>

          <Building2
            size={42}
            className="text-blue-600"
          />
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex justify-between">
          <div>
            <p className="text-slate-500">Job Postings</p>
            <h2 className="text-3xl font-bold">
              {jobs.length}
            </h2>
          </div>

          <BriefcaseBusiness
            size={42}
            className="text-purple-600"
          />
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex justify-between">
          <div>
            <p className="text-slate-500">Open Jobs</p>
            <h2 className="text-3xl font-bold">
              {openJobs}
            </h2>
          </div>

          <CircleCheckBig
            size={42}
            className="text-green-600"
          />
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex justify-between">
          <div>
            <p className="text-slate-500">Closed Jobs</p>
            <h2 className="text-3xl font-bold">
              {closedJobs}
            </h2>
          </div>

          <CircleX
            size={42}
            className="text-red-500"
          />
        </div>

      </div>

      {/* Filters */}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">

        <h2 className="text-xl font-semibold mb-5">
          Search & Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

          <SearchCompany
            value={search}
            onSearch={setSearch}
          />

          <CompanyFilter
            companies={companies}
            selectedCompany={selectedCompany}
            onChange={setSelectedCompany}
          />

          <DepartmentFilter
            value={department}
            onChange={setDepartment}
          />

          <BatchFilter
            value={batch}
            onChange={setBatch}
          />

          <JobStatusFilter
            value={status}
            onChange={setStatus}
          />

        </div>

      </div>

      {/* Companies */}

      <div className="grid lg:grid-cols-3 gap-8 mb-10">

        <div>
          <CompanyForm
            editingCompany={editingCompany}
            onSubmit={handleSubmitCompany}
            companies={companies}
          />
        </div>

        <div className="lg:col-span-2">
          {filteredCompanies.length ? (
            <CompanyTable
              companies={filteredCompanies}
              onView={handleViewCompany}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompanyClick}
            />
          ) : (
            <EmptyState message="No Companies Found" />
          )}
        </div>

      </div>

      {viewCompany && (
        <div className="mb-10">
          <CompanyDetails company={viewCompany} />
        </div>
      )}

      {/* Jobs */}

      <div className="grid lg:grid-cols-3 gap-8">

        <div>

          <JobPostingForm
            editingJob={editingJob}
            onSubmit={handleSubmitJob}
            jobs={jobs}
          />

        </div>

        <div className="lg:col-span-2">

          {filteredJobs.length ? (
            <JobPostingTable
              jobs={filteredJobs}
              onEdit={handleEditJob}
              onDelete={handleDeleteJobClick}
              onToggleStatus={toggleJobStatus}
            />
          ) : (
            <EmptyState message="No Job Postings Found" />
          )}

        </div>

      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!companyToDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this company?"
        onConfirm={handleConfirmDeleteCompany}
        onCancel={() => setCompanyToDelete(null)}
      />

      <DeleteJobPostingModal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleConfirmDeleteJob}
      />

    </div>
  );
};

export default CompanyJobPostingsPage;