// ProfileEditForm.jsx
// Purpose: Controlled form for editing all student profile fields including bio, phone, and social links
// Controlled form with validation — name, phone, city, department, CGPA


import { useState, useEffect } from "react";
import SkillTagSelector from "./SkillTagSelector";
import ResumeUploader from "./ResumeUploader";

// ── Validators ──────────────────────────────────────────
const validate = (form) => {
  const errors = {};

  if (!form.name.trim())
    errors.name = "Name is required.";
  else if (form.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!form.phone.trim())
    errors.phone = "Phone number is required.";
  else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
    errors.phone = "Enter a valid 10-digit Indian mobile number.";

  if (!form.city.trim())
    errors.city = "City is required.";

  if (!form.department.trim())
    errors.department = "Department is required.";

  if (form.cgpa === "")
    errors.cgpa = "CGPA is required.";
  else if (isNaN(form.cgpa) || Number(form.cgpa) < 0 || Number(form.cgpa) > 10)
    errors.cgpa = "CGPA must be between 0 and 10.";

  return errors;
};

// ── Field Component ─────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all
  ${hasError
    ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  }`;

// ── Main Form ───────────────────────────────────────────
const ProfileEditForm = ({ profile, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    department: "",
    cgpa: "",
    skills: [],
    resumeFile: null,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        department: profile.department || "",
        cgpa: profile.cgpa ?? "",
        skills: profile.skills || [],
        resumeFile: null,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    // Simulate API delay — replace with real API call later
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);

    onSave({
      ...form,
      cgpa: Number(form.cgpa),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Personal Info */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Personal Information
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" required error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Rahul Sharma"
              className={inputClass(errors.name)}
            />
          </Field>

          <Field label="Phone Number" required error={errors.phone}>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength={10}
              className={inputClass(errors.phone)}
            />
          </Field>

          <Field label="City" required error={errors.city}>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Pune"
              className={inputClass(errors.city)}
            />
          </Field>

          <Field label="Department" required error={errors.department}>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className={inputClass(errors.department)}
            >
              <option value="">Select department</option>
              <option>Computer Engineering</option>
              <option>Information Technology</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
              <option>Electronics & Telecommunication</option>
              <option>Electrical Engineering</option>
            </select>
          </Field>

          <Field label="CGPA" required error={errors.cgpa}>
            <input
              name="cgpa"
              type="number"
              value={form.cgpa}
              onChange={handleChange}
              placeholder="8.5"
              min="0"
              max="10"
              step="0.01"
              className={inputClass(errors.cgpa)}
            />
          </Field>
        </div>
      </div>

      {/* Skills */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Skills
        </p>
        <Field label="Select or type skills" error={errors.skills}>
          <SkillTagSelector
            skills={form.skills}
            onChange={(updated) => setForm((prev) => ({ ...prev, skills: updated }))}
          />
        </Field>
      </div>

      {/* Resume */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Resume
        </p>
        <ResumeUploader
          resumeFile={form.resumeFile}
          onUpload={(file) => setForm((prev) => ({ ...prev, resumeFile: file }))}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
