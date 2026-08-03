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
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
  </div>
);

const FieldDisplay = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
      {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
    </span>
  </div>
);

const FieldInput = ({ label, name, value, onChange, error, type = 'text', required, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {Icon && <Icon className="h-4 w-4 text-gray-400" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 dark:text-white ${
        error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-500'
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

/**
 * A component for displaying and editing education history.
 * Supports view and edit modes with validation.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {boolean} [props.isEditing=false] - Whether the component is in edit mode
 * @param {Function} [props.onUpdate] - Callback when education history is updated with form data
 * @param {Object} [props.validationErrors={}] - Validation errors object
 * @returns {JSX.Element} The education history component
 */
const EducationHistory = ({ profile = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const educationHistory = profile.educationHistory || [];

  const [form, setForm] = useState({
    previousEducation: educationHistory.previousEducation || '',
    schoolName: educationHistory.schoolName || '',
    yearCompleted: educationHistory.yearCompleted || ''
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
      onUpdate(form);
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  if (!isEditing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
        <SectionHeader
          title="Education History"
          subtitle="Your academic background"
        />
        {educationHistory.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No education history provided</p>
        ) : (
          <div className="space-y-4">
            {educationHistory.map((entry, index) => (
              <div
                key={entry.id || index}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-700/50"
              >
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
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="Education History"
        subtitle="Update your academic background"
      />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              Previous Education
            </label>
            <input
              type="text"
              name="previousEducation"
              value={form.previousEducation}
              onChange={handleChange}
              placeholder="e.g., High School, Diploma"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
          <FieldInput
            label="School / Institution"
            name="schoolName"
            value={form.schoolName}
            onChange={handleChange}
            error={errors.schoolName}
            required
            icon={School}
          />
          <FieldInput
            label="Year Completed"
            name="yearCompleted"
            type="number"
            value={form.yearCompleted}
            onChange={handleChange}
            error={errors.yearCompleted}
            required
            icon={Calendar}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onUpdate && onUpdate(null)}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationHistory;
