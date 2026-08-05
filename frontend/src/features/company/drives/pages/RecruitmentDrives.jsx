import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Mail, Phone } from 'lucide-react';
import { DrivesHeader } from '../components/DrivesHeader';
import { DriveFilters } from '../components/DriveFilters';
import { DrivesTable } from '../components/DrivesTable';
import { CreateDriveDrawer } from '../components/CreateDriveDrawer';
import { StageBadge } from '../components/StageBadge';
import { useCompanyDrives } from '../../hooks/useCompanyDrives';

// Helper to extract year from driveName or deadline
const getDriveYear = (drive) => {
  const match = drive.driveName.match(/\b(202[4-7])\b/);
  if (match) return match[1];
  
  if (drive.rawDeadline) {
    const deadlineMatch = drive.rawDeadline.match(/\b(202[4-7])\b/);
    if (deadlineMatch) return deadlineMatch[1];
  }
  return null;
};

export const RecruitmentDrives = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldOpenCreateDrive = Boolean(location.state?.openCreateDrive);
  const [isDrawerOpen, setIsDrawerOpen] = useState(shouldOpenCreateDrive);

  const {
    drives,
    loading,
    error,
    createDrive,
    updateDrive,
    closeDrive,
    pauseDrive,
    fetchCandidates
  } = useCompanyDrives();

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: '',
    year: '',
  });

  const [activeModal, setActiveModal] = useState(null); // 'view' | 'edit' | 'candidates' | 'changeStage' | 'delete'
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    if (shouldOpenCreateDrive) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, shouldOpenCreateDrive]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && activeModal === 'view') {
        setActiveModal(null);
      }
    };
    if (activeModal === 'view') {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeModal]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getUniqueValues = (key) => {
    if (key === 'department') {
      const values = drives.map(drive => drive.role);
      return [...new Set(values)].filter(Boolean);
    }
    const values = drives.map(drive => drive[key]);
    return [...new Set(values)].filter(Boolean);
  };

  const handleCreateDrive = async (driveData) => {
    try {
<<<<<<< HEAD
      const payload = {
        company: companyName,
        role: drive.driveName || 'Campus Drive',
        package: drive.salary || 'Competitive',
        drive_date: drive.date || new Date().toISOString().split('T')[0],
        deadline: drive.date || new Date().toISOString().split('T')[0],
        status: 'Open',
        eligibility: {
          cgpa: 6.0,
          departments: drive.college ? [drive.college] : []
        },
        rounds: []
      };

      await placementDriveService.createPlacementDrive(payload);
      toast.success('Drive created successfully');
      await fetchDrivesList();
=======
      await createDrive(driveData);
      toast.success('Recruitment drive created successfully');
>>>>>>> college-team
    } catch (err) {
      toast.error('Failed to create recruitment drive');
    }
  };

  const filteredDrives = drives.filter(drive => {
    const search = filters.search.trim().toLowerCase();
    const matchSearch = !search || (() => {
      const company = (drive.company || "").toLowerCase();
      const role = (drive.role || drive.driveName || "").toLowerCase();
      const location = (drive.location || "").toLowerCase();
      const skills = (drive.skills || drive.eligibility?.skills || "").toLowerCase();
      const hiringProcess = (drive.hiringProcess || "").toLowerCase();
      const status = (drive.stage || drive.status || "").toLowerCase();
      const eligibilityStr = JSON.stringify(drive.eligibility || {}).toLowerCase();
      
      return (
        company.includes(search) ||
        role.includes(search) ||
        location.includes(search) ||
        skills.includes(search) ||
        hiringProcess.includes(search) ||
        status.includes(search) ||
        eligibilityStr.includes(search)
      );
    })();
    const matchStatus = !filters.status || drive.stage === filters.status;
    const matchDepartment = !filters.department || drive.role === filters.department;
    const driveYear = getDriveYear(drive);
    const matchYear = !filters.year || driveYear === filters.year;
    return matchSearch && matchStatus && matchDepartment && matchYear;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin inline-block"></div>
          <p className="text-gray-600 mt-4 font-semibold">Loading recruitment drives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div>
        <DrivesHeader onCreateClick={() => setIsDrawerOpen(true)} />
        {error && (
          <div className="mx-8 my-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium">
            {error}
          </div>
        )}
        <DriveFilters
          filters={filters}
          updateFilter={updateFilter}
          getUniqueValues={getUniqueValues}
        />
        <DrivesTable
          drives={filteredDrives}
          onView={(drive) => {
            setSelectedDrive(drive);
            setActiveModal('view');
          }}
          onEdit={(drive) => {
            setSelectedDrive(drive);
            setActiveModal('edit');
          }}
          onViewCandidates={(drive) => {
            setSelectedDrive(drive);
            setActiveModal('candidates');
          }}
          onChangeStage={(drive) => {
            setSelectedDrive(drive);
            setActiveModal('changeStage');
          }}
          onDelete={(drive) => {
            setSelectedDrive(drive);
            setActiveModal('delete');
          }}
        />
      </div>

      <CreateDriveDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCreate={handleCreateDrive}
      />

      {/* View Drive Modal */}
      {activeModal === 'view' && selectedDrive && (
        <div
          className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="responsive-modal-panel bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Drive Details</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Drive Name</label>
                <p className="text-gray-800 font-medium text-[16px]">{selectedDrive.driveName}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Role / Department</label>
                  <p className="text-gray-800 font-medium text-[15px]">{selectedDrive.role} / {selectedDrive.department || 'General'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Candidates Registered</label>
                  <p className="text-gray-800 font-medium text-[15px]">{selectedDrive.candidates}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Salary Package</label>
                  <p className="text-gray-800 font-medium text-[15px]">{selectedDrive.salaryPackage || 'Not Disclosed'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Work Mode</label>
                  <p className="text-gray-800 font-medium text-[15px]">{selectedDrive.workMode} ({selectedDrive.location || 'Bangalore'})</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Status</label>
                  <div className="mt-1">
                    <StageBadge stage={selectedDrive.stage} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Deadline</label>
                  <p className="text-gray-800 font-medium text-[15px]">{selectedDrive.deadline}</p>
                </div>
              </div>
            </div>
            <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Drive Modal */}
      {activeModal === 'edit' && selectedDrive && (
        <EditDriveModal
          drive={selectedDrive}
          onClose={() => setActiveModal(null)}
          onSave={async (updatedDrive) => {
            try {
<<<<<<< HEAD
              const payload = {
                company: updatedDrive.company || companyName,
                role: updatedDrive.role,
                package: updatedDrive.package || 'Competitive',
                drive_date: updatedDrive.rawDriveDate || new Date().toISOString().split('T')[0],
                deadline: updatedDrive.rawDeadline || new Date().toISOString().split('T')[0],
                status: updatedDrive.stage === 'Active' ? 'Open' : (updatedDrive.stage === 'Screening' ? 'Upcoming' : (updatedDrive.stage === 'Cancelled' ? 'Cancelled' : 'Completed')),
              };
              await placementDriveService.updatePlacementDrive(updatedDrive.id, payload);
=======
              await updateDrive(selectedDrive.id, {
                jobTitle: updatedDrive.jobTitle,
                department: updatedDrive.department,
                requiredSkills: updatedDrive.requiredSkills,
                salaryPackage: updatedDrive.salaryPackage,
                workMode: updatedDrive.workMode,
                location: updatedDrive.location,
                deadline: updatedDrive.rawDeadline
              });
>>>>>>> college-team
              toast.success('Drive updated successfully');
              setActiveModal(null);
            } catch (err) {
              toast.error('Failed to update drive');
            }
          }}
        />
      )}

      {/* View Candidates Modal */}
      {activeModal === 'candidates' && selectedDrive && (
        <ViewCandidatesModal
          drive={selectedDrive}
          fetchCandidates={fetchCandidates}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Change Stage Modal */}
      {activeModal === 'changeStage' && selectedDrive && (
        <ChangeStageModal
          drive={selectedDrive}
          onClose={() => setActiveModal(null)}
          onSave={async (newStage) => {
            try {
<<<<<<< HEAD
              const payload = {
                company: selectedDrive.company || companyName,
                role: selectedDrive.role,
                package: selectedDrive.package || 'Competitive',
                drive_date: selectedDrive.rawDriveDate || new Date().toISOString().split('T')[0],
                deadline: selectedDrive.rawDeadline || new Date().toISOString().split('T')[0],
                status: newStage === 'Active' ? 'Open' : (newStage === 'Screening' ? 'Upcoming' : (newStage === 'Cancelled' ? 'Cancelled' : 'Completed')),
              };
              await placementDriveService.updatePlacementDrive(selectedDrive.id, payload);
=======
              if (newStage === 'CLOSED') {
                await closeDrive(selectedDrive.id);
              } else if (newStage === 'PAUSED') {
                await pauseDrive(selectedDrive.id);
              } else {
                await updateDrive(selectedDrive.id, { status: 'active' });
              }
>>>>>>> college-team
              toast.success('Stage updated successfully');
              setActiveModal(null);
            } catch (err) {
              toast.error('Failed to update stage');
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === 'delete' && selectedDrive && (
        <DeleteConfirmationModal
          drive={selectedDrive}
          onClose={() => setActiveModal(null)}
          onDelete={async () => {
            try {
              await closeDrive(selectedDrive.id);
              toast.success('Drive closed successfully');
              setActiveModal(null);
            } catch (err) {
              toast.error('Failed to close drive');
            }
          }}
        />
      )}
    </div>
  );
};

// Edit Drive Modal Component
const EditDriveModal = ({ drive, onClose, onSave }) => {
  const [jobTitle, setJobTitle] = useState(drive.jobTitle);
  const [department, setDepartment] = useState(drive.department || 'Engineering');
  const [requiredSkills, setRequiredSkills] = useState(drive.requiredSkills ? drive.requiredSkills.join(', ') : 'React, Node.js');
  const [salaryPackage, setSalaryPackage] = useState(drive.salaryPackage);
  const [workMode, setWorkMode] = useState(drive.workMode);
  const [location, setLocation] = useState(drive.location);
  const [rawDeadline, setRawDeadline] = useState(drive.rawDeadline);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (isSubmitting) return;
    if (!driveName.trim() || !role.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave({
        ...drive,
        driveName,
        role,
        stage,
        deadline
      });
    } finally {
      setIsSubmitting(false);
    }
=======
    if (!jobTitle.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave({
      jobTitle,
      department,
      requiredSkills: requiredSkills.split(',').map(s => s.trim()),
      salaryPackage,
      workMode,
      location,
      rawDeadline
    });
>>>>>>> college-team
  };

  return (
    <div
      className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={() => !isSubmitting && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="responsive-modal-panel bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Edit Drive</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 space-y-5 max-h-[450px] overflow-y-auto">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Drive Name / Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills</label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Salary Package */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Package</label>
            <input
              type="text"
              value={salaryPackage}
              onChange={(e) => setSalaryPackage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
            >
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Job Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
            <input
              type="date"
              value={rawDeadline}
              onChange={(e) => setRawDeadline(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

// View Candidates Modal Component
const ViewCandidatesModal = ({ drive, fetchCandidates, onClose }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const data = await fetchCandidates(drive.id);
        setCandidates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCandidates();
  }, [drive.id, fetchCandidates]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="responsive-modal-panel bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Candidates</h3>
            <p className="text-sm text-gray-500 mt-1">
              Associated with <span className="font-semibold text-gray-700">{drive.driveName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[450px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm mt-3">Loading candidates...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No candidates associated with this drive.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((c) => (
                <div key={c.candidateId} className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50 transition flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{c.name}</h4>
                      <p className="text-xs text-gray-505 font-medium mt-1">Status: {c.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Change Stage Modal Component
const ChangeStageModal = ({ drive, onClose, onSave }) => {
  const [selectedStage, setSelectedStage] = useState(drive.stage);
  const stages = ['ACTIVE', 'PAUSED', 'CLOSED'];

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isSubmitting]);

  return (
    <div
      className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="responsive-modal-panel bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Change Stage</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Select a new recruitment stage for <span className="font-semibold text-gray-700">{drive.driveName}</span>:
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {stages.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedStage(stage)}
                className={`w-full px-5 py-4 rounded-2xl border text-left font-semibold text-[15px] flex items-center justify-between transition ${
                  selectedStage === stage
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{stage}</span>
                <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                  {selectedStage === stage && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                await onSave(selectedStage);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? "Updating..." : "Update Stage"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ drive, onClose, onDelete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isSubmitting]);

  return (
    <div
      className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="responsive-modal-panel bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Close Drive</h3>
          <p className="text-sm text-gray-505">
            Are you sure you want to close this recruitment drive? This will freeze registrations.
          </p>
        </div>
        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
<<<<<<< HEAD
            disabled={isSubmitting}
            onClick={async () => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                await onDelete();
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? "Deleting..." : "Delete"}
=======
            onClick={onDelete}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-750 transition"
          >
            Close Drive
>>>>>>> college-team
          </button>
        </div>
      </div>
    </div>
  );
};
