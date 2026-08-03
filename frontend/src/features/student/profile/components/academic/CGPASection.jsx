import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { validateCGPA } from '../../../utils/studentProfileHelpers';

const getCGPAColor = (cgpa, maxCgpa = 10) => {
  const percentage = (cgpa / maxCgpa) * 100;
  if (percentage >= 80) return { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50', label: 'Excellent' };
  if (percentage >= 60) return { bar: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Good' };
  if (percentage >= 40) return { bar: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', label: 'Average' };
  return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', label: 'Needs Improvement' };
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
  </div>
);

const FieldDisplay = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
      {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
    </span>
  </div>
);

const FieldInput = ({ label, name, value, onChange, error, type = 'number', required, icon: Icon }) => (
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
 * A component for displaying and editing CGPA information.
 * Supports view and edit modes with validation and color-coded progress.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {boolean} [props.isEditing=false] - Whether the component is in edit mode
 * @param {Function} [props.onUpdate] - Callback when CGPA is updated
 * @param {Object} [props.validationErrors={}] - Validation errors object
 * @returns {JSX.Element} The CGPA section component
 */
const CGPASection = ({ profile = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const [form, setForm] = useState({
    cgpa: profile.cgpa ?? '',
    maxCgpa: profile.maxCgpa ?? 10,
    gradeScale: profile.gradeScale || '10.0'
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
    const errors = validateCGPA(form.cgpa, form.maxCgpa);
    setLocalErrors(errors);

    if (Object.keys(errors).length === 0 && onUpdate) {
      onUpdate({
        cgpa: parseFloat(form.cgpa),
        maxCgpa: parseFloat(form.maxCgpa),
        gradeScale: form.gradeScale
      });
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  const cgpaValue = typeof profile.cgpa === 'number' ? profile.cgpa : parseFloat(profile.cgpa) || 0;
  const maxCgpaValue = typeof profile.maxCgpa === 'number' ? profile.maxCgpa : parseFloat(form.maxCgpa) || 10;
  const colors = getCGPAColor(cgpaValue, maxCgpaValue);
  const progressPercentage = Math.min(100, Math.max(0, (cgpaValue / maxCgpaValue) * 100));

  if (!isEditing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
        <SectionHeader
          title="CGPA"
          subtitle="Your cumulative grade point average"
        />
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text} dark:bg-opacity-20`}>
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {cgpaValue.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400">/ {maxCgpaValue.toFixed(2)}</span>
            </div>
            <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}>
              {colors.label}
            </span>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden dark:bg-gray-700">
            <div
              className={`h-3 rounded-full transition-all duration-700 ease-out ${colors.bar}`}
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="CGPA"
        subtitle="Update your cumulative grade point average"
      />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FieldInput
            label="CGPA"
            name="cgpa"
            type="number"
            value={form.cgpa}
            onChange={handleChange}
            error={errors.cgpa}
            required
            min="0"
            max={form.maxCgpa || 10}
            step="0.01"
          />
          <FieldInput
            label="Max CGPA"
            name="maxCgpa"
            type="number"
            value={form.maxCgpa}
            onChange={handleChange}
            error={errors.maxCgpa}
            min="1"
            max="20"
            step="0.01"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              Grade Scale
              <span className="text-red-500">*</span>
            </label>
            <select
              name="gradeScale"
              value={form.gradeScale}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="4.0">4.0 Scale (US)</option>
              <option value="5.0">5.0 Scale</option>
              <option value="10.0">10.0 Scale (India)</option>
            </select>
          </div>
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

export default CGPASection;
