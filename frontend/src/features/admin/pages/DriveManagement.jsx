import DriveTable from "../components/DriveTable";
import DriveCreateModal from "../components/DriveCreateModal";
import useDriveManagement from "../hooks/useDriveManagement";

export default function DriveManagement() {
  const {
    search,
    setSearch,
    company,
    setCompany,
    status,
    setStatus,
    stage,
    setStage,

    currentDrives,
    filteredDrives,

    currentPage,
    setCurrentPage,
    totalPages,

    showModal,
    setShowModal,

    addDrive,

    loading,
    error,

    deleteDrive,
    freezeDrive,
    unfreezeDrive,
  } = useDriveManagement();

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Recruitment Drive Management
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          + New Drive
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search Drive..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 border px-3 py-2 rounded"
        />

        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full sm:flex-1 border px-3 py-2 rounded"
        >
          <option value="all">All Companies</option>
          <option value="TechCorp Ltd">TechCorp Ltd</option>
          <option value="InfoSys">InfoSys</option>
          <option value="Analytics Plus">Analytics Plus</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:flex-1 border px-3 py-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="frozen">Frozen</option>
        </select>

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="w-full sm:flex-1 border px-3 py-2 rounded"
        >
          <option value="all">All Stages</option>
          <option value="screening">Screening</option>
          <option value="training">Training</option>
          <option value="shortlist">Shortlist</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center text-gray-500">Loading drives...</div>
      ) : (
        <>
          {/* Count */}
          <p className="mb-4 text-slate-600">
            Showing {filteredDrives.length} drives
          </p>

          {/* Table */}
          <DriveTable
            drives={currentDrives}
            onDelete={(id) => {
              if (window.confirm("Delete this drive?")) {
                deleteDrive(id);
              }
            }}
            onFreeze={freezeDrive}
            onUnfreeze={unfreezeDrive}
          />

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Create Drive Modal */}
      {showModal && (
        <DriveCreateModal
          onClose={() => setShowModal(false)}
          addDrive={addDrive}
        />
      )}
    </div>
  );
}
