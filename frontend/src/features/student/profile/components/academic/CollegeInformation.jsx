import { useState } from 'react';
import { Building2, Users, Calendar, CalendarX } from 'lucide-react';

const validateCollegeInfo = (data) => {
  const errors = {};

  if (!data.collegeName || data.collegeName.trim() === '') {
    errors.collegeName = 'College name is required';
  }

  if (!data.university || data.university.trim() === '') {
    errors.university = 'University name is required';
  }

  if (!data.yearOfJoining || isNaN(Number(data.yearOfJoining))) {
    errors.yearOfJoining = 'Valid year of joining is required';
  } else {
    const year = Number(data.yearOfJoining);
    const currentYear = new Date().getFullYear();
    if (year < 1990 || year > currentYear) {
      errors.yearOfJoining = `Year must be between 1990 and ${currentYear}`;
    }
  }

  if (!data.expectedGraduation || isNaN(Number(data.expectedGraduation))) {
    errors.expectedGraduation = 'Valid expected graduation year is required';
  } else {
    const gradYear = Number(data.expectedGraduation);
    if (gradYear < 1990 || gradYear > 2100) {
      errors.expectedGraduation = 'Year must be between 1990 and 2100';
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
 * A component for displaying and editing college information.
 * Supports view and edit modes with validation.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {boolean} [props.isEditing=false] - Whether the component is in edit mode
 * @param {Function} [props.onUpdate] - Callback when college info is updated with form data
 * @param {Object} [props.validationErrors={}] - Validation errors object
 * @returns {JSX.Element} The college information component
 */
const CollegeInformation = ({ profile = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const college = profile.college || {};

  const [form, setForm] = useState({
    collegeName: college.collegeName || '',
    university: college.university || '',
    yearOfJoining: college.yearOfJoining || '',
    expectedGraduation: college.expectedGraduation || ''
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
    const errors = validateCollegeInfo(form);
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
          title="College Information"
          subtitle="Your institution details"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FieldDisplay label="College Name" value={college.collegeName} icon={Building2} />
          <FieldDisplay label="University" value={college.university} icon={Users} />
          <FieldDisplay label="Year of Joining" value={college.yearOfJoining ? String(college.yearOfJoining) : ''} icon={Calendar} />
          <FieldDisplay label="Expected Graduation" value={college.expectedGraduation ? String(college.expectedGraduation) : ''} icon={CalendarX} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="College Information"
        subtitle="Update your institution details"
      />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput
            label="College Name"
            name="collegeName"
            value={form.collegeName}
            onChange={handleChange}
            error={errors.collegeName}
            required
            icon={Building2}
          />
          <FieldInput
            label="University"
            name="university"
            value={form.university}
            onChange={handleChange}
            error={errors.university}
            required
            icon={Users}
          />
          <FieldInput
            label="Year of Joining"
            name="yearOfJoining"
            type="number"
            value={form.yearOfJoining}
            onChange={handleChange}
            error={errors.yearOfJoining}
            required
            icon={Calendar}
          />
          <FieldInput
            label="Expected Graduation"
            name="expectedGraduation"
            type="number"
            value={form.expectedGraduation}
            onChange={handleChange}
            error={errors.expectedGraduation}
            required
            icon={CalendarX}
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

export default CollegeInformation;
