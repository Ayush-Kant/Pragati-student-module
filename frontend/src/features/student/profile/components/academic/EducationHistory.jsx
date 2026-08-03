import { useState } from 'react';
import { School, Calendar } from 'lucide-react';

const validateEducationHistory = (data) => {
  const errors = {};
  if (!data.schoolName || data.schoolName.trim() === '') {
    errors.schoolName = 'School name is required';
  }
  if (!data.yearCompleted || isNaN(Number(data.yearCompleted))) {
    errors.yearCompleted = 'Valid year completed is required';
  } else {
    const year = Number(data.yearCompleted);
    const currentYear = new Date().getFullYear();
    if (year < 1950 || year > currentYear) {
      errors.yearCompleted = `Year must be between 1950 and ${currentYear}`;
    }
  }
  return errors;
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const FieldDisplay = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon className="h-3.5 w-3.5 text-orange-500" />}
      {label}
    </span>
    <span className="text-sm font-medium text-white">
      {value || <span className="text-gray-500 italic font-normal">Not provided</span>}
    </span>
  </div>
);

const FieldInput = ({ label, name, value, onChange, error, type = 'text', required, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
      {Icon && <Icon className="h-4 w-4 text-orange-500" />}
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
        error ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
      }`}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

const EducationHistory = ({ profile = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const educationHistory = profile.educationHistory || [];
  const historyEntry = Array.isArray(educationHistory) ? educationHistory[0] : (educationHistory || {});
  const [form, setForm] = useState({
    previousEducation: historyEntry.previousEducation || '',
    schoolName: historyEntry.schoolName || '',
    yearCompleted: historyEntry.yearCompleted || ''
  });
  const [localErrors, setLocalErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (localErrors[name]) {
      setLocalErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEducationHistory(form);
    setLocalErrors(errors);
    if (Object.keys(errors).length === 0 && onUpdate) {
      onUpdate({ educationHistory: [form] });
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  if (!isEditing) {
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
        <SectionHeader title="Education History" subtitle="Your academic background" />
        {educationHistory.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No education history provided</p>
        ) : (
          <div className="space-y-4">
            {educationHistory.map((entry, index) => (
              <div key={entry.id || index} className="rounded-xl border border-gray-700/50 bg-white/5 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FieldDisplay label="Previous Education" value={entry.previousEducation || ''} />
                  <FieldDisplay label="School / Institution" value={entry.schoolName} icon={School} />
                  <FieldDisplay label="Year Completed" value={entry.yearCompleted ? String(entry.yearCompleted) : ''} icon={Calendar} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="Education History" subtitle="Update your academic background" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Previous Education</label>
            <input
              type="text"
              name="previousEducation"
              value={form.previousEducation}
              onChange={handleChange}
              placeholder="e.g., High School, Diploma"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white/5 text-white"
            />
          </div>
          <FieldInput label="School / Institution" name="schoolName" value={form.schoolName} onChange={handleChange} error={errors.schoolName} required icon={School} />
          <FieldInput label="Year Completed" name="yearCompleted" type="number" value={form.yearCompleted} onChange={handleChange} error={errors.yearCompleted} required icon={Calendar} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => onUpdate && onUpdate(null)} className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-gray-700 rounded-xl hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#050505]">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationHistory;
