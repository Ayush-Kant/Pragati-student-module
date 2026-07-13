import { useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
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
    updateCandidate,
    getUniqueValues
  } = useCandidates();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit modal state
  const [editingCandidate, setEditingCandidate] = useState(null);

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
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(prev => ({ ...prev, status: 'Rejected' }));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Edit handlers
  const handleOpenEdit = (candidate) => {
    setEditingCandidate(candidate);
  };

  const handleSaveEdit = (updatedFields) => {
    updateCandidate(editingCandidate.id, updatedFields);
    toast.success('Candidate updated successfully');
    setEditingCandidate(null);
  };

  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Candidate Table Area */}
          <div className="flex-1 min-w-0 w-full">
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
              onEdit={handleOpenEdit}
            />
          </div>

          {/* Inline Candidate Profile Details card (Desktop - lg and above) */}
          {isDrawerOpen && selectedCandidate && (
            <div className="hidden lg:block w-[420px] shrink-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden sticky top-[90px]">
              <CandidateDrawer
                isOpen={isDrawerOpen}
                candidate={selectedCandidate}
                onClose={handleCloseDrawer}
                onShortlist={handleShortlist}
                onReject={handleReject}
                isUpdating={isUpdating}
                inline={true}
              />
            </div>
          )}
        </div>

        {/* Floating Backdrop drawer fallback (Mobile / Tablet - under lg size) */}
        <div className="block lg:hidden">
          <CandidateDrawer
            isOpen={isDrawerOpen}
            candidate={selectedCandidate}
            onClose={handleCloseDrawer}
            onShortlist={handleShortlist}
            onReject={handleReject}
            isUpdating={isUpdating}
            inline={false}
          />
        </div>

        {/* Edit Candidate Modal */}
        {editingCandidate && (
          <EditCandidateModal
            candidate={editingCandidate}
            onClose={() => setEditingCandidate(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

// ─── Edit Candidate Modal ────────────────────────────────────────────────────

const STATUSES = ['Shortlisted', 'Assessment', 'Interview', 'Rejected', 'Offered'];

const EditCandidateModal = ({ candidate, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: candidate.name || '',
    college: candidate.college || '',
    role: candidate.role || '',
    score: candidate.score ?? '',
    status: candidate.status || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Candidate name is required';
    if (!form.college.trim()) newErrors.college = 'College is required';
    if (!form.role.trim()) newErrors.role = 'Role is required';
    if (!form.status) newErrors.status = 'Status is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({
      name: form.name.trim(),
      college: form.college.trim(),
      role: form.role.trim(),
      score: form.score === '' ? candidate.score : Number(form.score),
      status: form.status,
      // Recompute avatar initial from updated name
      avatar: form.name.trim().charAt(0).toUpperCase(),
    });
  };

  return (
    <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="responsive-modal-panel bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Edit Candidate</h3>
            <p className="text-sm text-gray-500 mt-1">Update candidate information</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition mt-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="p-8 space-y-5">
          {/* Candidate Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Candidate Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="e.g. Rahul Patil"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              College <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.college}
              onChange={(e) => handleChange('college', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.college ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="e.g. IIT Bombay"
            />
            {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.role ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="e.g. Software Engineer"
            />
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          {/* Score */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Score (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.score}
              onChange={(e) => handleChange('score', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              placeholder="e.g. 92"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white ${
                errors.status ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            >
              <option value="">Select status</option>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateManagement;
