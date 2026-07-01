import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';
import { TrainingHeader } from '../components/TrainingHeader';
import { TrainingAnalyticsCards } from '../components/TrainingAnalyticsCards';
import { TrainingFilters } from '../components/TrainingFilters';
import { TrainingTable } from '../components/TrainingTable';
import { TrainingStatusBadge } from '../components/TrainingStatusBadge';
import api from '../../../../services/api';
import "../../styles/companyDashboard.css";


// PRD returns: { trainingId, title, mentor, status, completionPercentage, attendancePercentage, studentCount }
const normalize = (p) => ({
  id:             p.trainingId,
  program:        p.title,
  mentor:         p.mentor ?? '—',
  mentorInitials: (p.mentor ?? '')
                    .split(' ').slice(0, 2)
                    .map(w => w[0]?.toUpperCase() ?? '').join(''),
  students:       p.studentCount ?? 0,
  completion:     p.completionPercentage != null ? `${p.completionPercentage}%` : '—',
  attendance:     p.attendancePercentage  != null ? `${p.attendancePercentage}%`  : '—',
  status:         p.status ?? 'Active',
});

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
        <ViewProgramModal program={selectedProgram} onClose={closeModal} />
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
const ModalShell = ({ title, subtitle, onClose, children, footer }) => (
  <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="responsive-modal-panel relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
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
const ViewProgramModal = ({ program, onClose }) => {
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/api/v1/company/training/${program.id}`);
        setDetail(res.data.data);
      } catch {
        toast.error('Failed to load program details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [program.id]);

  return (
    <ModalShell
      title="Program Details"
      onClose={onClose}
      footer={
        <button onClick={onClose} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
          Close
        </button>
      }
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-5">
          {[
            ['Program Name', detail?.title         ?? program.program],
            ['Mentor',       detail?.mentor         ?? program.mentor],
            ['Students',     detail?.studentCount   ?? program.students],
            ['Completion',   detail?.completionPercentage != null ? `${detail.completionPercentage}%` : program.completion],
            ['Attendance',   detail?.attendancePercentage != null ? `${detail.attendancePercentage}%` : program.attendance],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-gray-800 font-medium text-[15px]">{value}</p>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <TrainingStatusBadge status={detail?.status ?? program.status} />
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
