import { useEffect, useMemo, useState } from "react";
import useDisputes from "../hooks/useDisputes";
import DisputeFilters from "../components/DisputeFilters";
import DisputeTable from "../components/DisputeTable";
import {useOutletContext} from "react-router-dom";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "open", label: "Open" },
  { key: "in review", label: "In Review" },
  { key: "resolved", label: "Resolved" },
];

const DisputeManagement = () => {
  const {
    disputes,
    loading,
    error,
    page,
    limit,
    total,
    filters,
    setFilters,
    setPage,
  } = useDisputes();

  const { darkMode } = useOutletContext();

  const [activeTab, setActiveTab] = useState(filters.status);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: activeTab,
    }));

    setPage(1);
  }, [activeTab]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const PageSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-72 {darkMode ? 'bg-gray-200' : 'bg-gray-300'} rounded"></div>

      <div className="bg-white rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 {darkMode ? 'bg-gray-200' : 'bg-gray-300'} rounded"></div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-10 w-24 {darkMode ? 'bg-gray-200' : 'bg-gray-300'}   rounded"></div>
        ))}
      </div>
    </div>
  );

  const counts = useMemo(() => {
    return {
      all: total,
      open: disputes.filter((d) => d.status === "open").length,
      review: disputes.filter((d) => d.status === "in review").length,
      resolved: disputes.filter((d) => d.status === "resolved").length,
    };
  }, [disputes, total]);

  if(loading) {
      return <PageSkeleton />
    }

  return (
    

    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Dispute Resolution Center
        </h1>

        <p className="text-gray-500 mt-1">
          View, review and resolve disputes raised by users.
        </p>
      </div>

      {/* Filters */}
      <DisputeFilters
        filters={filters}
        setFilters={setFilters}
        setPage={setPage}
      />

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-3">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.key === ""
              ? counts.all
              : tab.key === "open"
              ? counts.open
              : tab.key === "in review"
              ? counts.review
              : counts.resolved;

          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg transition font-medium ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : `${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200'}`
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-300 bg-red-50 rounded-lg p-4">
          <h3 className="font-semibold text-red-700">
            Failed to load disputes
          </h3>

          <p className="text-red-500 mt-1">
            {error}
          </p>
        </div>
      )}

      {/* Table */}
      <DisputeTable
        disputes={disputes}
        loading={loading}
        error=""
      />

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded ${
            page === 1
              ? `${darkMode ? 'bg-gray-600' : 'bg-gray-200'} text-gray-400 cursor-not-allowed`
              : `${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-white hover:bg-black`
          }`}
        >
          Previous
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded ${
            page === totalPages
              ? `${darkMode ? 'bg-gray-600' : 'bg-gray-200'} text-gray-400 cursor-not-allowed`
              : `${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-white hover:bg-black`
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DisputeManagement;