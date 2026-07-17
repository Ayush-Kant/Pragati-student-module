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
    <>
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          bg-black/30
          backdrop-blur-sm
          z-40
        "
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className="
          fixed
          top-[68px]
          right-0
          h-[calc(100vh-68px)]
          w-[420px]
          bg-white
          shadow-2xl
          z-50
          overflow-y-auto
          flex
          flex-col
          rounded-l-3xl
          responsive-drawer
        "
      >
        <div className="pt-24">
          {/* Header */}
          <div className="px-7 pb-6 flex items-start justify-between">
            <h2 className="text-[40px] leading-tight font-bold text-gray-900">
              Create Recruitment Drive
            </h2>

            <button
              onClick={handleClose}
              className="
                mt-2
                ml-4
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-gray-100
                transition
                text-gray-500
                hover:text-gray-800
                shrink-0
              "
            >
              <X size={22} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
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
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="workMode" value="Remote" checked={form.workMode === 'Remote'} onChange={handleChange} className="w-4 h-4" />
                  <span className="text-sm text-gray-700">Remote</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="workMode" value="Onsite" checked={form.workMode === 'Onsite'} onChange={handleChange} className="w-4 h-4" />
                  <span className="text-sm text-gray-700">On-site</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="workMode" value="Hybrid" checked={form.workMode === 'Hybrid'} onChange={handleChange} className="w-4 h-4" />
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
                rows="6"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
              />
            </div>

            {/* Extra space for sticky buttons */}
            <div className="h-24" />
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div className="responsive-drawer-footer fixed bottom-0 right-0 w-[420px] bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
          >
            Publish Drive
          </button>
        </div>
      </div>
    </>
  );
};
