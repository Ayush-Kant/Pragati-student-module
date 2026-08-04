import { useState } from 'react';
import { GraduationCap, BookOpen, Calendar } from 'lucide-react';

const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const validateAcademicInfo = (data) => {
  const errors = {};
  if (!data.department || data.department.trim() === '') {
    errors.department = 'Department is required';
  }
  if (!data.course || data.course.trim() === '') {
    errors.course = 'Course is required';
  }
  if (data.semester === undefined || data.semester === null || data.semester === '') {
    errors.semester = 'Semester is required';
  } else {
    const semester = Number(data.semester);
    if (isNaN(semester) || semester < 1 || semester > 8) {
      errors.semester = 'Semester must be between 1 and 8';
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

const FieldInput = ({ label, name, value, onChange, error, type = 'text', required, icon: Icon, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
      {Icon && <Icon className="h-4 w-4 text-orange-500" />}
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    {children || (
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
        }`}
      />
    )}
  </div>
);

const AcademicInformation = ({ profile = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const [form, setForm] = useState({
    department: profile.department || '',
    course: profile.course || '',
    semester: profile.semester || ''
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
    const errors = validateAcademicInfo(form);
    setLocalErrors(errors);
    if (Object.keys(errors).length === 0 && onUpdate) {
      onUpdate(form);
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  if (!isEditing) {
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
        <SectionHeader title="Academic Information" subtitle="Your course and department details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FieldDisplay label="Department" value={profile.department} icon={GraduationCap} />
          <FieldDisplay label="Course" value={profile.course} icon={BookOpen} />
          <FieldDisplay label="Semester" value={profile.semester ? `Semester ${profile.semester}` : ''} icon={Calendar} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="Academic Information" subtitle="Update your course and department details" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput label="Department" name="department" value={form.department} onChange={handleChange} error={errors.department} required icon={GraduationCap} />
          <FieldInput label="Course" name="course" value={form.course} onChange={handleChange} error={errors.course} required icon={BookOpen} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-orange-500" />
              Semester
              <span className="text-red-400">*</span>
            </label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
                errors.semester ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
              }`}
            >
              <option value="" className="bg-gray-800">Select semester</option>
              {SEMESTER_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-gray-800">Semester {option}</option>
              ))}
            </select>
            {errors.semester && <p className="text-xs text-red-400">{errors.semester}</p>}
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

export default AcademicInformation;
