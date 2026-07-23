import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const defaultDriveForm = {
  driveName: '',
  department: 'Engineering',
  requiredSkills: 'React, Node.js',
  salaryPackage: '8 LPA',
  workMode: 'Hybrid',
  location: 'Pune',
  deadline: '',
  description: '',
};

export const CreateDriveDrawer = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState(defaultDriveForm);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setForm(defaultDriveForm);
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setForm(defaultDriveForm);
    onClose();
  };

  const handlePublish = () => {
    if (!form.driveName.trim()) return;

    onCreate?.({
      jobTitle: form.driveName,
      department: form.department,
      requiredSkills: form.requiredSkills.split(',').map(s => s.trim()),
      salaryPackage: form.salaryPackage,
      workMode: form.workMode,
      location: form.location,
      deadline: form.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: form.description
    });
    setForm(defaultDriveForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="responsive-modal-panel bg-white rounded-3xl w-full max-w-lg max-h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Create Recruitment Drive</h3>
            <p className="text-sm text-gray-500 mt-1">Start a new recruitment campaign</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition mt-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-8 space-y-5 overflow-y-auto flex-1 text-left">
          {/* Drive Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Drive Name / Job Title</label>
            <input
              name="driveName"
              type="text"
              placeholder="e.g., Senior Software Engineer Drive"
              value={form.driveName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <input
              name="department"
              type="text"
              placeholder="e.g., Engineering"
              value={form.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills (comma-separated)</label>
            <input
              name="requiredSkills"
              type="text"
              placeholder="React, Node.js, MongoDB"
              value={form.requiredSkills}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Salary Package */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Package</label>
            <input
              name="salaryPackage"
              type="text"
              placeholder="₹12-15 LPA"
              value={form.salaryPackage}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Work Mode</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="workMode" value="Remote" checked={form.workMode === 'Remote'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Remote</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="workMode" value="Onsite" checked={form.workMode === 'Onsite'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">On-site</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="workMode" value="Hybrid" checked={form.workMode === 'Hybrid'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Hybrid</span>
              </label>
            </div>
          </div>

          {/* Job Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Location</label>
            <input
              name="location"
              type="text"
              placeholder="e.g., Pune"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hiring Deadline</label>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
          >
            Publish Drive
          </button>
        </div>
      </div>
    </div>
  );
};
