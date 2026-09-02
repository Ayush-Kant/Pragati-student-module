import { useEffect, useState } from "react";
import SkillTagSelector from "./SkillTagSelector";

const validate = (form) => {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (form.phone && !/^[0-9+()\-\s]{7,20}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (form.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth)) {
    errors.dateOfBirth = "Use YYYY-MM-DD format.";
  }

  if (form.city.length > 100) errors.city = "City must be at most 100 characters.";
  if (form.department.length > 150) errors.department = "Department must be at most 150 characters.";

  if (form.cgpa !== "" && (Number.isNaN(Number(form.cgpa)) || Number(form.cgpa) < 0 || Number(form.cgpa) > 10)) {
    errors.cgpa = "CGPA must be between 0 and 10.";
  }

  if (form.semester !== "" && (Number.isNaN(Number(form.semester)) || Number(form.semester) < 1 || Number(form.semester) > 20)) {
    errors.semester = "Semester must be between 1 and 20.";
  }

  const urls = ["linkedin", "github", "portfolio"];
  urls.forEach((field) => {
    if (form[field] && !/^https?:\/\/\S+$/i.test(form[field])) {
      errors[field] = "Enter a valid HTTP(S) URL.";
    }
  });

  if (form.resumeUrl && !/^https?:\/\/\S+$/i.test(form.resumeUrl)) {
    errors.resumeUrl = "Enter a valid HTTP(S) URL.";
  }

  return errors;
};

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error ? <p className="text-xs text-red-500">{error}</p> : null}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all ${
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
  }`;

const toFormState = (profile) => ({
  name: profile?.personal?.name || "",
  phone: profile?.personal?.phone || "",
  dateOfBirth: profile?.personal?.dateOfBirth || "",
  gender: profile?.personal?.gender || "",
  bio: profile?.personal?.bio || "",
  city: profile?.contact?.city || "",
  state: profile?.contact?.state || "",
  country: profile?.contact?.country || "",
  pincode: profile?.contact?.pincode || "",
  department: profile?.academic?.department || "",
  institutionName: profile?.academic?.institutionName || "",
  course: profile?.academic?.course || "",
  degree: profile?.academic?.degree || "",
  semester: profile?.academic?.semester ?? "",
  cgpa: profile?.academic?.cgpa ?? "",
  graduationYear: profile?.academic?.graduationYear ?? "",
  admissionYear: profile?.academic?.admissionYear ?? "",
  academicEmail: profile?.academic?.academicEmail || "",
  linkedin: profile?.social?.linkedin || "",
  github: profile?.social?.github || "",
  portfolio: profile?.social?.portfolio || profile?.social?.website || "",
  resumeUrl: profile?.resume?.url || "",
  skills: Array.isArray(profile?.skills) ? profile.skills.map((skill) => skill.name).filter(Boolean) : [],
});

const ProfileEditForm = ({ profile, onSave, onCancel, saving = false }) => {
  const [form, setForm] = useState(() => toFormState(profile));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(toFormState(profile));
    setErrors({});
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      personal: {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender || null,
        bio: form.bio.trim() || null,
      },
      contact: {
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        country: form.country.trim() || null,
        pincode: form.pincode.trim() || null,
      },
      academic: {
        institutionName: form.institutionName.trim() || null,
        department: form.department.trim() || null,
        course: form.course.trim() || null,
        degree: form.degree.trim() || null,
        semester: form.semester === "" ? null : Number(form.semester),
        cgpa: form.cgpa === "" ? null : Number(form.cgpa),
        graduationYear: form.graduationYear === "" ? null : Number(form.graduationYear),
        admissionYear: form.admissionYear === "" ? null : Number(form.admissionYear),
        academicEmail: form.academicEmail.trim() || null,
      },
      skills: form.skills.map((name) => ({ name })),
      social: {
        linkedin: form.linkedin.trim() || null,
        github: form.github.trim() || null,
        portfolio: form.portfolio.trim() || null,
      },
      resume: form.resumeUrl.trim()
        ? {
            url: form.resumeUrl.trim(),
            fileName: profile?.resume?.fileName || null,
            fileSize: profile?.resume?.fileSize ?? null,
            mimeType: profile?.resume?.mimeType || null,
          }
        : null,
    };

    await onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <section>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Personal information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" required error={errors.name}>
            <input name="name" value={form.name} onChange={handleChange} className={inputClass(errors.name)} autoComplete="name" />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <input name="phone" value={form.phone} onChange={handleChange} className={inputClass(errors.phone)} autoComplete="tel" />
          </Field>
          <Field label="Date of birth" error={errors.dateOfBirth}>
            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className={inputClass(errors.dateOfBirth)} />
          </Field>
          <Field label="Gender">
            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass(false)}>
              <option value="">Prefer not to say</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Bio">
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} maxLength={2000} className={`${inputClass(false)} resize-y`} placeholder="Tell recruiters or mentors a little about yourself." />
            </Field>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Contact information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" error={errors.city}>
            <input name="city" value={form.city} onChange={handleChange} className={inputClass(errors.city)} />
          </Field>
          <Field label="State">
            <input name="state" value={form.state} onChange={handleChange} className={inputClass(false)} />
          </Field>
          <Field label="Country">
            <input name="country" value={form.country} onChange={handleChange} className={inputClass(false)} />
          </Field>
          <Field label="Pincode">
            <input name="pincode" value={form.pincode} onChange={handleChange} maxLength={10} className={inputClass(false)} />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Academic information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Institution">
            <input name="institutionName" value={form.institutionName} onChange={handleChange} className={inputClass(false)} />
          </Field>
          <Field label="Department" error={errors.department}>
            <input name="department" value={form.department} onChange={handleChange} className={inputClass(errors.department)} />
          </Field>
          <Field label="Course">
            <input name="course" value={form.course} onChange={handleChange} className={inputClass(false)} />
          </Field>
          <Field label="Degree">
            <input name="degree" value={form.degree} onChange={handleChange} className={inputClass(false)} />
          </Field>
          <Field label="Semester" error={errors.semester}>
            <input name="semester" type="number" min="1" max="20" value={form.semester} onChange={handleChange} className={inputClass(errors.semester)} />
          </Field>
          <Field label="CGPA" error={errors.cgpa}>
            <input name="cgpa" type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={handleChange} className={inputClass(errors.cgpa)} />
          </Field>
          <Field label="Admission year">
            <input name="admissionYear" type="number" min="1900" max="2200" value={form.admissionYear} onChange={handleChange} className={inputClass(false)} />
          </Field>
          <Field label="Graduation year">
            <input name="graduationYear" type="number" min="1900" max="2200" value={form.graduationYear} onChange={handleChange} className={inputClass(false)} />
          </Field>
          <Field label="Academic email">
            <input name="academicEmail" type="email" value={form.academicEmail} onChange={handleChange} className={inputClass(false)} />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Skills</h2>
        <SkillTagSelector skills={form.skills} onChange={(skills) => setForm((previous) => ({ ...previous, skills }))} />
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Professional links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="LinkedIn" error={errors.linkedin}>
            <input name="linkedin" type="url" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className={inputClass(errors.linkedin)} />
          </Field>
          <Field label="GitHub" error={errors.github}>
            <input name="github" type="url" value={form.github} onChange={handleChange} placeholder="https://github.com/..." className={inputClass(errors.github)} />
          </Field>
          <Field label="Portfolio / website" error={errors.portfolio}>
            <input name="portfolio" type="url" value={form.portfolio} onChange={handleChange} placeholder="https://..." className={inputClass(errors.portfolio)} />
          </Field>
          <Field label="Resume URL" error={errors.resumeUrl}>
            <input name="resumeUrl" type="url" value={form.resumeUrl} onChange={handleChange} placeholder="https://.../resume.pdf" className={inputClass(errors.resumeUrl)} />
          </Field>
        </div>
        <p className="mt-2 text-xs text-gray-400">Resume upload storage is not implemented by the current profile API, so this field stores an existing HTTP(S) resume URL without introducing a second upload system.</p>
      </section>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
