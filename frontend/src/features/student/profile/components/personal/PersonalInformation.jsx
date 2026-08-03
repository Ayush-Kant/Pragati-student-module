import { useState } from 'react';
import { User, Calendar, Users, FileText } from 'lucide-react';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const validatePersonalInfo = (data) => {
  const errors = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required (min 2 characters)';
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }

  if (!data.gender || !GENDER_OPTIONS.includes(data.gender)) {
    errors.gender = 'Valid gender selection is required';
  }

  if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio must not exceed 500 characters';
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

const FieldInput = ({ label, name, value, onChange, error, type = 'text', required, icon: Icon, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {Icon && <Icon className="h-4 w-4 text-gray-400" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children || (
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 dark:text-white ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-500'
        }`}
      />
    )}
  </div>
);

/**
 * A component for displaying and editing personal information.
 * Supports view and edit modes with validation.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {boolean} [props.isEditing=false] - Whether the component is in edit mode
 * @param {Function} [props.onUpdate] - Callback when profile is updated with form data
 * @param {Object} [props.validationErrors={}] - Validation errors object
 * @returns {JSX.Element} The personal information component
 */
const PersonalInformation = ({ profile = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const [form, setForm] = useState({
    fullName: profile.fullName || '',
    dateOfBirth: profile.dateOfBirth || '',
    gender: profile.gender || '',
    bio: profile.bio || ''
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
    const errors = validatePersonalInfo(form);
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
          title="Personal Information"
          subtitle="Basic details about you"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FieldDisplay label="Full Name" value={profile.fullName} icon={User} />
          <FieldDisplay label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : ''} icon={Calendar} />
          <FieldDisplay label="Gender" value={profile.gender} icon={Users} />
        </div>
        {profile.bio && (
          <div className="mt-5">
            <FieldDisplay label="Bio" value={profile.bio} icon={FileText} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="Personal Information"
        subtitle="Update your basic details"
      />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
            icon={User}
          />
          <FieldInput
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            required
            icon={Calendar}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-400" />
              Gender
              <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 dark:text-white ${
                errors.gender ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-500'
              }`}
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <FileText className="h-4 w-4 text-gray-400" />
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white dark:bg-gray-700 dark:text-white resize-none"
          />
          <p className="text-xs text-gray-400 text-right">{form.bio.length}/500</p>
          {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
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

export default PersonalInformation;
