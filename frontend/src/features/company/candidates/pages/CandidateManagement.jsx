import { useState } from 'react';
import { CandidateHeader } from '../components/CandidateHeader';
import { CandidateFilters } from '../components/CandidateFilters';
import { CandidateTable } from '../components/CandidateTable';
import { CandidateDrawer } from '../components/CandidateDrawer';
import { useCandidates } from '../hooks/useCandidates';

const CandidateManagement = () => {
  const {
    candidates,
    allCandidates,
    loading,
    error,
    filters,
    updateFilter,
    updateCandidateStatus,
    getUniqueValues
  } = useCandidates();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCandidate(null);
  };

  const handleShortlist = async (candidateId) => {
    try {
      setIsUpdating(true);
      await updateCandidateStatus(candidateId, 'Shortlisted');
      // Update selected candidate if it's the same one
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(prev => ({ ...prev, status: 'Shortlisted' }));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (candidateId) => {
    try {
      setIsUpdating(true);
      await updateCandidateStatus(candidateId, 'Rejected');
      // Update selected candidate if it's the same one
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(prev => ({ ...prev, status: 'Rejected' }));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="w-full">
        {/* Header */}
        <CandidateHeader />

        {/* Filters */}
        <CandidateFilters
          filters={filters}
          updateFilter={updateFilter}
          getUniqueValues={getUniqueValues}
          allCandidates={allCandidates}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Table */}
        <CandidateTable
          candidates={candidates}
          loading={loading}
          onSelectCandidate={handleSelectCandidate}
          onMenuClick={handleSelectCandidate}
        />

        {/* Drawer */}
        <CandidateDrawer
          isOpen={isDrawerOpen}
          candidate={selectedCandidate}
          onClose={handleCloseDrawer}
          onShortlist={handleShortlist}
          onReject={handleReject}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
};

export default CandidateManagement;
