import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Loader2, Award, Calendar, CheckCircle2, BookOpen, User, Users, AlertCircle, Edit, Star } from 'lucide-react';
import { TrainingHeader } from '../components/TrainingHeader';
import { TrainingAnalyticsCards } from '../components/TrainingAnalyticsCards';
import { TrainingFilters } from '../components/TrainingFilters';
import { TrainingTable } from '../components/TrainingTable';
import { TrainingStatusBadge } from '../components/TrainingStatusBadge';
import api from '../../../../services/api';
import "../../styles/companyDashboard.css";


const normalize = (p) => {
  const mentorName = p.mentor && typeof p.mentor === 'object' ? p.mentor.name : (typeof p.mentor === 'string' ? p.mentor : '');
  return {
    id:             p.trainingId,
    program:        p.title,
    mentor:         mentorName || '—',
    mentorInitials: mentorName
                      ? mentorName.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
                      : '—',
    students:       p.candidatesEnrolled ?? p.studentCount ?? 0,
    completion:     p.completionPercentage != null ? `${p.completionPercentage}%` : '—',
    attendance:     p.attendancePercentage  != null ? `${p.attendancePercentage}%`  : '—',
    status:         p.status ?? 'Active',
  };
};

export const TrainingManagement = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [filters, setFilters]           = useState({ search: '', mentor: '', status: '' });

  const [activeModal, setActiveModal]         = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  //PRD: GET /api/v1/company/training 
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/v1/company/training');
        setTrainingData(res.data.data.map(normalize));
      } catch {
        setError('Failed to load training programs. Please try again.');
        toast.error('Failed to load training programs');
      } finally {
        setLoading(false);
      }
    };
    fetchTraining();
  }, []);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const getUniqueValues = (key) => {
    const values = trainingData.map(p => p[key]);
    return [...new Set(values)].filter(Boolean);
  };

  const filteredPrograms = trainingData.filter(program => {
    const matchSearch = program.program.toLowerCase().includes(filters.search.toLowerCase());
    const matchMentor = !filters.mentor || program.mentor === filters.mentor;
    const matchStatus = !filters.status || program.status === filters.status;
    return matchSearch && matchMentor && matchStatus;
  });

  const handleMenuClick = (program, action) => {
    setSelectedProgram(program);
    if (action === 'view') {
      setActiveModal('view');
    } else if (action === 'edit') {
      setActiveModal('edit');
    } else if (action === 'manage') {
      setActiveModal('manage');
    } else if (action === 'complete') {
      // local state only — no PRD endpoint for this on company panel
      if (program.status === 'Completed') {
        toast('Program is already marked as completed', { icon: 'ℹ️' });
        return;
      }
      setTrainingData(prev =>
        prev.map(p => p.id === program.id ? { ...p, status: 'Completed' } : p)
      );
      toast.success('Program marked as completed');
    } else if (action === 'delete') {
      setActiveModal('delete');
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedProgram(null);
  };

  // local state only — no PRD endpoint for edit on company panel
  const handleSaveEdit = (updatedFields) => {
    setTrainingData(prev =>
      prev.map(p => p.id === selectedProgram.id ? { ...p, ...updatedFields } : p)
    );
    toast.success('Training program updated successfully');
    closeModal();
  };

  // local state only — no PRD endpoint for delete on company panel
  const handleDelete = () => {
    setTrainingData(prev => prev.filter(p => p.id !== selectedProgram.id));
    toast.success('Training program deleted');
    closeModal();
  };

  // local state only — no PRD endpoint for manage students on company panel
  const handleUpdateStudents = (newStudentList) => {
    setTrainingData(prev =>
      prev.map(p => p.id === selectedProgram.id
        ? { ...p, students: newStudentList.length }
        : p
      )
    );
    setSelectedProgram(prev => ({ ...prev, students: newStudentList.length }));
  };

  const handleMentorAssigned = (programId, mentorName) => {
    setTrainingData(prev =>
      prev.map(p => p.id === programId
        ? {
            ...p,
            mentor: mentorName,
            mentorInitials: mentorName !== '—'
              ? mentorName.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
              : '—'
          }
        : p
      )
    );
  };

  //Loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Loading training programs...</p>
        </div>
      </div>
    );
  }

  //Error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div>
        <TrainingHeader />
        <TrainingAnalyticsCards />
        <TrainingFilters
          filters={filters}
          updateFilter={updateFilter}
          getUniqueValues={getUniqueValues}
        />
        <TrainingTable
          programs={filteredPrograms}
          onMenuClick={handleMenuClick}
        />
      </div>

      {activeModal === 'view' && selectedProgram && (
        <ViewProgramModal program={selectedProgram} onClose={closeModal} onMentorAssigned={handleMentorAssigned} />
      )}
      {activeModal === 'edit' && selectedProgram && (
        <EditProgramModal
          program={selectedProgram}
          onClose={closeModal}
          onSave={handleSaveEdit}
        />
      )}
      {activeModal === 'manage' && selectedProgram && (
        <ManageStudentsModal
          program={selectedProgram}
          onClose={closeModal}
          onUpdate={handleUpdateStudents}
        />
      )}
      {activeModal === 'delete' && selectedProgram && (
        <DeleteConfirmModal
          program={selectedProgram}
          onClose={closeModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

/* ─── Shared modal shell ──────────────────────────────────────────────────── */
const ModalShell = ({ title, subtitle, onClose, children, footer, maxWidth = 'max-w-2xl' }) => (
  <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className={`responsive-modal-panel relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} mx-4 max-h-[85vh] overflow-y-auto`}>
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition mt-1">
          <X size={20} />
        </button>
      </div>
      <div className="p-8">{children}</div>
      {footer && (
        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  </div>
);

/* ─── View Program Modal ─────────────────────────────────────────────────────
   PRD: GET /api/v1/company/training/:id                                         */
const ViewProgramModal = ({ program, onClose, onMentorAssigned }) => {
  const [detail, setDetail] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [mentorsList, setMentorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [showMentorDropdown, setShowMentorDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [detailRes, analyticsRes, mentorsRes] = await Promise.all([
          api.get(`/v1/company/training/${program.id}`),
          api.get(`/v1/company/training/${program.id}/progress`),
          api.get("/v1/company/training/mentors").catch(() => ({ data: { data: [] } }))
        ]);
        setDetail(detailRes.data.data);
        setAnalytics(analyticsRes.data.data);
        setMentorsList(mentorsRes.data?.data || []);
        if (detailRes.data.data?.mentor?.mentorId) {
          setSelectedMentorId(detailRes.data.data.mentor.mentorId);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load training details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [program.id]);

  const handleAssignMentor = async () => {
    if (!selectedMentorId) {
      toast.error("Please select a mentor first");
      return;
    }
    try {
      setAssigning(true);
      await api.patch(`/v1/company/training/${program.id}/assign-mentor`, {
        mentorId: selectedMentorId
      });
      const selectedMentor = mentorsList.find(m => String(m.mentorId) === String(selectedMentorId));
      const mentorName = selectedMentor ? selectedMentor.name : "—";
      
      setDetail(prev => ({
        ...prev,
        mentor: selectedMentor 
          ? { mentorId: selectedMentor.mentorId, name: selectedMentor.name, email: selectedMentor.email }
          : null
      }));
      
      onMentorAssigned(program.id, mentorName);
      toast.success("Mentor assigned successfully");
      setShowMentorDropdown(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to assign mentor");
    } finally {
      setAssigning(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <ModalShell
      title="Program Coordination Dashboard"
      subtitle={`${detail?.title ?? program.program} · Training Analytics & Mentor Sync`}
      onClose={onClose}
      maxWidth="max-w-4xl"
      footer={
        <button onClick={onClose} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
          Close
        </button>
      }
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Basic Details & Mentor Assignment */}
          <div className="space-y-6">
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-500" />
                Program Information
              </h4>
              
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Program Title</p>
                <p className="text-gray-800 font-semibold text-[15px]">{detail?.title ?? program.program}</p>
              </div>

              {detail?.description && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Description</p>
                  <p className="text-gray-600 text-sm">{detail.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="text-gray-800 font-medium text-sm flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-400" />
                    {detail?.duration ? `${detail.duration} weeks` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Status</p>
                  <div className="mt-1">
                    <TrainingStatusBadge status={detail?.status ?? program.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Start Date</p>
                  <p className="text-gray-800 font-medium text-sm flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(detail?.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">End Date</p>
                  <p className="text-gray-800 font-medium text-sm flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(detail?.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Mentor Coordination Section */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-blue-500" />
                  Mentor Alignment
                </h4>
                {!showMentorDropdown && (
                  <button
                    onClick={() => setShowMentorDropdown(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Edit size={12} />
                    Change Mentor
                  </button>
                )}
              </div>

              {showMentorDropdown ? (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Active Mentor</label>
                    <select
                      value={selectedMentorId}
                      onChange={(e) => setSelectedMentorId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Choose Mentor --</option>
                      {mentorsList.map((m) => (
                        <option key={m.mentorId} value={m.mentorId}>
                          {m.name} ({m.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowMentorDropdown(false)}
                      className="px-3.5 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignMentor}
                      disabled={assigning}
                      className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      {assigning && <Loader2 size={12} className="animate-spin" />}
                      Save Assignment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {detail?.mentor?.name
                      ? detail.mentor.name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("")
                      : "—"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{detail?.mentor?.name ?? "No mentor assigned yet"}</p>
                    {detail?.mentor?.email && (
                      <p className="text-xs text-gray-400">{detail.mentor.email}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Performance Analytics & Progress */}
          <div className="space-y-6">
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                Candidate Analytics
              </h4>

              {/* Completion Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400 uppercase tracking-wider">Completion Rate</span>
                  <span className="text-blue-600 font-bold">{analytics?.completionPercentage ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${analytics?.completionPercentage ?? 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Attendance Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400 uppercase tracking-wider">Attendance Rate</span>
                  <span className="text-indigo-600 font-bold">{analytics?.attendanceRate ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${analytics?.attendanceRate ?? 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Assignment Submissions */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400 uppercase tracking-wider">Assignment Submissions</span>
                  <span className="text-purple-600 font-bold">
                    {analytics?.assignmentSubmissions?.completed ?? 0} Completed
                  </span>
                </div>
                <div className="flex h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  {((analytics?.assignmentSubmissions?.completed ?? 0) + (analytics?.assignmentSubmissions?.pending ?? 0)) > 0 ? (
                    <>
                      <div 
                        className="bg-purple-500 h-full" 
                        style={{ width: `${((analytics?.assignmentSubmissions?.completed ?? 0) / ((analytics?.assignmentSubmissions?.completed ?? 0) + (analytics?.assignmentSubmissions?.pending ?? 0))) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-amber-400 h-full" 
                        style={{ width: `${((analytics?.assignmentSubmissions?.pending ?? 0) / ((analytics?.assignmentSubmissions?.completed ?? 0) + (analytics?.assignmentSubmissions?.pending ?? 0))) * 100}%` }}
                      ></div>
                    </>
                  ) : (
                    <div className="bg-gray-200 w-full h-full"></div>
                  )}
                </div>
                <div className="flex gap-4 text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>Completed ({analytics?.assignmentSubmissions?.completed ?? 0})</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>Pending ({analytics?.assignmentSubmissions?.pending ?? 0})</span>
                </div>
              </div>

              {/* Engagement & Performance Ratings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Engagement Rating</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold text-gray-800">{analytics?.engagementScore ?? "0.0"}</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          size={13} 
                          fill={i < Math.round(analytics?.engagementScore ?? 0) ? "currentColor" : "none"} 
                          stroke="currentColor" 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Perf Rating (Avg)</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-800">{analytics?.performanceMetrics?.average ?? 0}</span>
                    <div className="text-[9px] text-gray-400 flex gap-2 font-bold uppercase">
                      <div>
                        <span className="text-green-600 block">{analytics?.performanceMetrics?.highest ?? 0}</span>
                        <span>High</span>
                      </div>
                      <div>
                        <span className="text-red-500 block">{analytics?.performanceMetrics?.lowest ?? 0}</span>
                        <span>Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Readiness Evaluation indicator */}
              {analytics?.completionPercentage >= 75 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-3 border border-emerald-100">
                  <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">High Hiring Readiness</p>
                    <p className="text-xs text-emerald-600">Students have achieved a readiness evaluation score &gt; 75%.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-xl flex items-center gap-3 border border-amber-100">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Training In Progress</p>
                    <p className="text-xs text-amber-600">Completion score is {analytics?.completionPercentage ?? 0}%. Target is 75% before final interviews.</p>
                  </div>
                </div>
              )}

              {/* Mentor feedback */}
              <div className="p-4 bg-white border border-dashed border-gray-200 rounded-xl space-y-1.5">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Latest Mentor Feedback</span>
                <p className="text-sm text-gray-600 italic">
                  {analytics?.mentorFeedback ? `"${analytics.mentorFeedback}"` : "No qualitative feedback submitted by mentor yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

/* ─── Edit Program Modal (local state only) ──────────────────────────────── */
const STATUSES = ['Active', 'Completed'];

const EditProgramModal = ({ program, onClose, onSave }) => {
  const [form, setForm] = useState({
    program:    program.program,
    mentor:     program.mentor,
    students:   program.students,
    completion: parseInt(program.completion) || 0,
    attendance: parseInt(program.attendance) || 0,
    status:     program.status,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.program.trim()) errs.program = 'Program name is required';
    if (!form.mentor.trim())  errs.mentor  = 'Mentor is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const mentorInitials = form.mentor
      .split(' ').slice(0, 2)
      .map(w => w[0]?.toUpperCase() || '').join('');
    onSave({
      program:        form.program.trim(),
      mentor:         form.mentor.trim(),
      mentorInitials,
      students:       Number(form.students) || 0,
      completion:     `${form.completion}%`,
      attendance:     `${form.attendance}%`,
      status:         form.status,
    });
  };

  return (
    <ModalShell
      title="Edit Program"
      subtitle="Update training program details"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition">
            Cancel
          </button>
          <button form="edit-program-form" type="submit" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
            Save Changes
          </button>
        </>
      }
    >
      <form id="edit-program-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Program Name <span className="text-red-500">*</span></label>
          <input type="text" value={form.program} onChange={e => handleChange('program', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${errors.program ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
          {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mentor <span className="text-red-500">*</span></label>
          <input type="text" value={form.mentor} onChange={e => handleChange('mentor', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${errors.mentor ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
          {errors.mentor && <p className="text-red-500 text-xs mt-1">{errors.mentor}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Students</label>
            <input type="number" min="0" value={form.students} onChange={e => handleChange('students', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Completion %</label>
            <input type="number" min="0" max="100" value={form.completion} onChange={e => handleChange('completion', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attendance %</label>
            <input type="number" min="0" max="100" value={form.attendance} onChange={e => handleChange('attendance', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select value={form.status} onChange={e => handleChange('status', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white">
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </form>
    </ModalShell>
  );
};

/* ─── Manage Students Modal (local state only) ───────────────────────────── */
const generateDefaultStudents = (count) =>
  Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Student ${i + 1}` }));

const ManageStudentsModal = ({ program, onClose, onUpdate }) => {
  const [students, setStudents] = useState(() => generateDefaultStudents(program.students));
  const [newName, setNewName]   = useState('');

  const addStudent = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const updated = [...students, { id: Date.now(), name: trimmed }];
    setStudents(updated);
    onUpdate(updated);
    setNewName('');
  };

  const removeStudent = (id) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    onUpdate(updated);
  };

  return (
    <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="responsive-modal-panel relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Manage Students</h3>
            <p className="text-sm text-gray-500 mt-1">{program.program} · <span className="font-semibold text-gray-700">{students.length} students</span></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition mt-1"><X size={20} /></button>
        </div>
        <div className="px-8 pt-6 flex gap-3">
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addStudent()}
            placeholder="Enter student name..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
          <button onClick={addStudent} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">Add</button>
        </div>
        <div className="p-8 max-h-[320px] overflow-y-auto space-y-2">
          {students.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No students enrolled</p>
          ) : (
            students.map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{s.name}</span>
                </div>
                <button onClick={() => removeStudent(s.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition">Remove</button>
              </div>
            ))
          )}
        </div>
        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">Done</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Delete Confirmation Modal (local state only) ───────────────────────── */
const DeleteConfirmModal = ({ program, onClose, onDelete }) => (
  <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="responsive-modal-panel relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[85vh] overflow-y-auto">
      <div className="p-8">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Training Program</h3>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete <span className="font-semibold text-gray-700">"{program.program}"</span>? This action cannot be undone.
        </p>
      </div>
      <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition">Cancel</button>
        <button onClick={onDelete} className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition">Delete</button>
      </div>
    </div>
  </div>
);
