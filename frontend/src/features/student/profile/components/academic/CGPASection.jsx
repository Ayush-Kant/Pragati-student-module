import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { validateCGPA } from '../../utils/studentProfileHelpers';

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const FieldInput = ({ label, name, value, onChange, error, type = 'number', required }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
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
  const progressPercentage = Math.min(100, Math.max(0, (cgpaValue / maxCgpaValue) * 100));

  if (!isEditing) {
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
        <SectionHeader title="CGPA" subtitle="Your cumulative grade point average" />
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{cgpaValue.toFixed(2)}</span>
              <span className="text-sm text-gray-400">/ {maxCgpaValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-400">Progress</span>
            <span className="text-xs font-bold text-white">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-700 ease-out"
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
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="CGPA" subtitle="Update your cumulative grade point average" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FieldInput label="CGPA" name="cgpa" type="number" value={form.cgpa} onChange={handleChange} error={errors.cgpa} required min="0" max={form.maxCgpa || 10} step="0.01" />
          <FieldInput label="Max CGPA" name="maxCgpa" type="number" value={form.maxCgpa} onChange={handleChange} error={errors.maxCgpa} min="1" max="20" step="0.01" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
              Grade Scale
              <span className="text-red-400">*</span>
            </label>
            <select
              name="gradeScale"
              value={form.gradeScale}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white/5 text-white"
            >
              <option value="4.0" className="bg-gray-800">4.0 Scale (US)</option>
              <option value="5.0" className="bg-gray-800">5.0 Scale</option>
              <option value="10.0" className="bg-gray-800">10.0 Scale (India)</option>
            </select>
          </div>
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

export default CGPASection;
