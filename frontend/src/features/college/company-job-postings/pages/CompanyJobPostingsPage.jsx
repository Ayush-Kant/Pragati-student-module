import { useState } from "react";
import { useOutletContext } from "react-router-dom";
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
  const { darkMode } = useOutletContext();
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

  const payload = {
    name: data.name,
    location: data.location,
    package: data.package
};


  if (editingCompany) {

    await editCompany(
      editingCompany.id,
      payload
    );

    setEditingCompany(null);

    if (viewCompany?.id === editingCompany.id) {

      setViewCompany({
        ...viewCompany,
        ...payload,
      });

    }

  } else {

    await addCompany(payload);

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
    return <LoadingSpinner darkMode={darkMode} />;
  }

  if (companyError || jobError) {
    return (
      <ErrorState
        message={companyError || jobError}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-[#1A1A1A]' : 'bg-slate-100'}`}>

      {/* Header */}

      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>
          Company Job Postings
        </h1>

        <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          Placement Management Dashboard
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className={`rounded-xl shadow p-6 flex justify-between ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'}`}>
          <div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Companies</p>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>
              {companies.length}
            </h2>
          </div>

          <Building2
            size={42}
            className={darkMode ? 'text-[#ff6d34]' : 'text-blue-600'}
          />
        </div>

        <div className={`rounded-xl shadow p-6 flex justify-between ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'}`}>
          <div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Job Postings</p>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>
              {jobs.length}
            </h2>
          </div>

          <BriefcaseBusiness
            size={42}
            className={darkMode ? 'text-[#00bea3]' : 'text-purple-600'}
          />
        </div>

        <div className={`rounded-xl shadow p-6 flex justify-between ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'}`}>
          <div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Open Jobs</p>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>
              {openJobs}
            </h2>
          </div>

          <CircleCheckBig
            size={42}
            className={darkMode ? 'text-[#00bea3]' : 'text-green-600'}
          />
        </div>

        <div className={`rounded-xl shadow p-6 flex justify-between ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'}`}>
          <div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Closed Jobs</p>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>
              {closedJobs}
            </h2>
          </div>

          <CircleX
            size={42}
            className={darkMode ? 'text-red-400' : 'text-red-500'}
          />
        </div>

      </div>

      {/* Filters */}

      <div className={`rounded-xl shadow-md p-6 mb-8 ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>

        <h2 className={`text-xl font-semibold mb-5 ${darkMode ? 'text-white' : ''}`}>
          Search & Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

          <SearchCompany
            value={search}
            onSearch={setSearch}
            darkMode={darkMode}
          />

          <CompanyFilter
            companies={companies}
            selectedCompany={selectedCompany}
            onChange={setSelectedCompany}
            darkMode={darkMode}
          />

          <DepartmentFilter
            value={department}
            onChange={setDepartment}
            darkMode={darkMode}
          />

          <BatchFilter
            value={batch}
            onChange={setBatch}
            darkMode={darkMode}
          />

          <JobStatusFilter
            value={status}
            onChange={setStatus}
            darkMode={darkMode}
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
            darkMode={darkMode}
          />
        </div>

        <div className="lg:col-span-2">
          {filteredCompanies.length ? (
            <CompanyTable
              companies={filteredCompanies}
              onView={handleViewCompany}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompanyClick}
              darkMode={darkMode}
            />
          ) : (
            <EmptyState message="No Companies Found" darkMode={darkMode} />
          )}
        </div>

      </div>

      {viewCompany && (
        <div className="mb-10">
          <CompanyDetails company={viewCompany} darkMode={darkMode} />
        </div>
      )}

      {/* Jobs */}

      <div className="grid lg:grid-cols-3 gap-8">

        <div>

          <JobPostingForm
            editingJob={editingJob}
            onSubmit={handleSubmitJob}
            jobs={jobs}
            darkMode={darkMode}
          />

        </div>

        <div className="lg:col-span-2">

          {filteredJobs.length ? (
            <JobPostingTable
              jobs={filteredJobs}
              onEdit={handleEditJob}
              onDelete={handleDeleteJobClick}
              onToggleStatus={toggleJobStatus}
              darkMode={darkMode}
            />
          ) : (
            <EmptyState message="No Job Postings Found" darkMode={darkMode} />
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
        darkMode={darkMode}
      />

      <DeleteJobPostingModal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleConfirmDeleteJob}
        darkMode={darkMode}
      />

    </div>
  );
};

export default CompanyJobPostingsPage;