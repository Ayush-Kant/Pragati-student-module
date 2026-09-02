import { useEffect, useState } from "react";
import SkillTagSelector from "./SkillTagSelector";

const isRealDate = (value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isHttpUrl = (value) => !value || /^https?:\/\/\S+$/i.test(value);

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

  if (form.alternatePhone && !/^[0-9+()\-\s]{7,20}$/.test(form.alternatePhone.trim())) {
    errors.alternatePhone = "Enter a valid phone number.";
  }

  if (form.dateOfBirth && !isRealDate(form.dateOfBirth)) {
    errors.dateOfBirth = "Enter a real calendar date.";
  }

  if (form.city.length > 100) errors.city = "City must be at most 100 characters.";
  if (form.department.length > 150) errors.department = "Department must be at most 150 characters.";

  if (form.cgpa !== "" && (Number.isNaN(Number(form.cgpa)) || Number(form.cgpa) < 0 || Number(form.cgpa) > 10)) {
    errors.cgpa = "CGPA must be between 0 and 10.";
  }

  if (form.semester !== "" && (Number.isNaN(Number(form.semester)) || Number(form.semester) < 1 || Number(form.semester) > 20)) {
    errors.semester = "Semester must be between 1 and 20.";
  }

  ["graduationYear", "admissionYear"].forEach((field) => {
    if (
      form[field] !== "" &&
      (Number.isNaN(Number(form[field])) || Number(form[field]) < 1900 || Number(form[field]) > 2200)
    ) {
      errors[field] = "Enter a valid year.";
    }
  });

  ["tenthPercentage", "twelfthPercentage"].forEach((field) => {
    if (
      form[field] !== "" &&
      (Number.isNaN(Number(form[field])) || Number(form[field]) < 0 || Number(form[field]) > 100)
    ) {
      errors[field] = "Percentage must be between 0 and 100.";
    }
  });

  ["backlogs", "activeBacklogs"].forEach((field) => {
    if (
      form[field] !== "" &&
      (Number.isNaN(Number(form[field])) || Number(form[field]) < 0 || Number(form[field]) > 1000)
    ) {
      errors[field] = "Enter a valid backlog count.";
    }
  });

  if (!isHttpUrl(form.linkedin)) errors.linkedin = "Enter a valid HTTP(S) URL.";
  if (!isHttpUrl(form.github)) errors.github = "Enter a valid HTTP(S) URL.";
  if (!isHttpUrl(form.portfolio)) errors.portfolio = "Enter a valid HTTP(S) URL.";
  if (!isHttpUrl(form.twitter)) errors.twitter = "Enter a valid HTTP(S) URL.";
  if (!isHttpUrl(form.website)) errors.website = "Enter a valid HTTP(S) URL.";
  if (!isHttpUrl(form.resumeUrl)) errors.resumeUrl = "Enter a valid HTTP(S) URL.";

  if (form.certifications.some((item) => item.issueDate && !isRealDate(item.issueDate))) {
    errors.certifications = "Certification issue dates must be valid calendar dates.";
  } else if (form.certifications.some((item) => item.expiryDate && !isRealDate(item.expiryDate))) {
    errors.certifications = "Certification expiry dates must be valid calendar dates.";
  }

  if (form.certifications.some((item) => item.credentialUrl && !isHttpUrl(item.credentialUrl))) {
    errors.certifications = "Certification credential URLs must use HTTP(S).";
  }

  if (form.documents.some((item) => item.documentUrl && !isHttpUrl(item.documentUrl))) {
    errors.documents = "Document URLs must use HTTP(S).";
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
  alternatePhone: profile?.contact?.alternatePhone || "",
  alternateEmail: profile?.contact?.alternateEmail || "",
  department: profile?.academic?.department || "",
  institutionName: profile?.academic?.institutionName || "",
  course: profile?.academic?.course || "",
  degree: profile?.academic?.degree || "",
  semester: profile?.academic?.semester ?? "",
  cgpa: profile?.academic?.cgpa ?? "",
  graduationYear: profile?.academic?.graduationYear ?? "",
  admissionYear: profile?.academic?.admissionYear ?? "",
  academicEmail: profile?.academic?.academicEmail || "",
  tenthPercentage: profile?.academic?.tenthPercentage ?? "",
  twelfthPercentage: profile?.academic?.twelfthPercentage ?? "",
  backlogs: profile?.academic?.backlogs ?? "",
  activeBacklogs: profile?.academic?.activeBacklogs ?? "",
  linkedin: profile?.social?.linkedin || "",
  github: profile?.social?.github || "",
  portfolio: profile?.social?.portfolio || "",
  twitter: profile?.social?.twitter || "",
  website: profile?.social?.website || "",
  resumeUrl: profile?.resume?.url || "",
  skills: Array.isArray(profile?.skills)
    ? profile.skills.map((skill) => skill.name).filter(Boolean)
    : [],
  certifications: Array.isArray(profile?.certifications)
    ? profile.certifications.map((item) => ({
        name: item.name || "",
        issuingOrganization: item.issuingOrganization || "",
        issueDate: item.issueDate || "",
        expiryDate: item.expiryDate || "",
        credentialId: item.credentialId || "",
        credentialUrl: item.credentialUrl || "",
      }))
    : [],
  documents: Array.isArray(profile?.documents)
    ? profile.documents.map((item) => ({
        documentType: item.documentType || "",
        documentName: item.documentName || "",
        fileName: item.fileName || "",
        documentUrl: item.documentUrl || "",
        fileSize: item.fileSize ?? "",
        mimeType: item.mimeType || "",
      }))
    : [],
});

const newCertification = () => ({
  name: "",
  issuingOrganization: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
});

const newDocument = () => ({
  documentType: "",
  documentName: "",
  fileName: "",
  documentUrl: "",
  fileSize: "",
  mimeType: "",
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

  const updateCertification = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      certifications: previous.certifications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setErrors((previous) => ({ ...previous, certifications: undefined }));
  };

  const updateDocument = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      documents: previous.documents.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setErrors((previous) => ({ ...previous, documents: undefined }));
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
        alternatePhone: form.alternatePhone.trim() || null,
        alternateEmail: form.alternateEmail.trim() || null,
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
        tenthPercentage: form.tenthPercentage === "" ? null : Number(form.tenthPercentage),
        twelfthPercentage: form.twelfthPercentage === "" ? null : Number(form.twelfthPercentage),
        backlogs: form.backlogs === "" ? null : Number(form.backlogs),
        activeBacklogs: form.activeBacklogs === "" ? null : Number(form.activeBacklogs),
      },
      skills: form.skills.map((name) => ({ name })),
      certifications: form.certifications
        .filter((item) => item.name.trim())
        .map((item) => ({
          name: item.name.trim(),
          issuingOrganization: item.issuingOrganization.trim() || null,
          issueDate: item.issueDate || null,
          expiryDate: item.expiryDate || null,
          credentialId: item.credentialId.trim() || null,
          credentialUrl: item.credentialUrl.trim() || null,
        })),
      social: {
        linkedin: form.linkedin.trim() || null,
        github: form.github.trim() || null,
        portfolio: form.portfolio.trim() || null,
        twitter: form.twitter.trim() || null,
        website: form.website.trim() || null,
      },
      resume: form.resumeUrl.trim()
        ? {
            url: form.resumeUrl.trim(),
            fileName: profile?.resume?.fileName || null,
            fileSize: profile?.resume?.fileSize ?? null,
            mimeType: profile?.resume?.mimeType || null,
          }
        : null,
      documents: form.documents
        .filter((item) => item.documentUrl.trim())
        .map((item) => ({
          documentType: item.documentType.trim() || null,
          documentName: item.documentName.trim() || null,
          fileName: item.fileName.trim() || null,
          documentUrl: item.documentUrl.trim(),
          fileSize: item.fileSize === "" ? null : Number(item.fileSize),
          mimeType: item.mimeType.trim() || null,
        })),
    };

    try {
      await onSave(payload);
    } catch {
      // Parent owns the request error state. Keep entered values intact so the
      // student can correct the form or retry without starting over.
    }
  };

  const setFormArray = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
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
          <Field label="Alternate phone" error={errors.alternatePhone}>
            <input name="alternatePhone" value={form.alternatePhone} onChange={handleChange} className={inputClass(errors.alternatePhone)} autoComplete="tel" />
          </Field>
          <Field label="Alternate email">
            <input name="alternateEmail" type="email" value={form.alternateEmail} onChange={handleChange} className={inputClass(false)} autoComplete="email" />
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
          <Field label="Admission year" error={errors.admissionYear}>
            <input name="admissionYear" type="number" min="1900" max="2200" value={form.admissionYear} onChange={handleChange} className={inputClass(errors.admissionYear)} />
          </Field>
          <Field label="Graduation year" error={errors.graduationYear}>
            <input name="graduationYear" type="number" min="1900" max="2200" value={form.graduationYear} onChange={handleChange} className={inputClass(errors.graduationYear)} />
          </Field>
          <Field label="Academic email">
            <input name="academicEmail" type="email" value={form.academicEmail} onChange={handleChange} className={inputClass(false)} />
          </Field>
          <Field label="10th percentage" error={errors.tenthPercentage}>
            <input name="tenthPercentage" type="number" min="0" max="100" step="0.01" value={form.tenthPercentage} onChange={handleChange} className={inputClass(errors.tenthPercentage)} />
          </Field>
          <Field label="12th percentage" error={errors.twelfthPercentage}>
            <input name="twelfthPercentage" type="number" min="0" max="100" step="0.01" value={form.twelfthPercentage} onChange={handleChange} className={inputClass(errors.twelfthPercentage)} />
          </Field>
          <Field label="Total backlogs" error={errors.backlogs}>
            <input name="backlogs" type="number" min="0" max="1000" value={form.backlogs} onChange={handleChange} className={inputClass(errors.backlogs)} />
          </Field>
          <Field label="Active backlogs" error={errors.activeBacklogs}>
            <input name="activeBacklogs" type="number" min="0" max="1000" value={form.activeBacklogs} onChange={handleChange} className={inputClass(errors.activeBacklogs)} />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Skills</h2>
        <SkillTagSelector
          skills={form.skills}
          onChange={(skills) => setForm((previous) => ({ ...previous, skills }))}
        />
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Certifications</h2>
            <p className="text-xs text-gray-400 mt-1">Add credentials already earned by you.</p>
          </div>
          <button
            type="button"
            onClick={() => setForm((previous) => ({ ...previous, certifications: [...previous.certifications, newCertification()] }))}
            className="px-3 py-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-lg"
          >
            Add certification
          </button>
        </div>
        {errors.certifications ? <p className="text-xs text-red-500 mb-3">{errors.certifications}</p> : null}
        <div className="space-y-4">
          {form.certifications.map((item, index) => (
            <div key={`certification-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex justify-between items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-gray-500">Certification {index + 1}</span>
                <button
                  type="button"
                  onClick={() => setFormArray("certifications", form.certifications.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={item.name} onChange={(event) => updateCertification(index, "name", event.target.value)} placeholder="Certificate name" className={inputClass(false)} />
                <input value={item.issuingOrganization} onChange={(event) => updateCertification(index, "issuingOrganization", event.target.value)} placeholder="Issuing organization" className={inputClass(false)} />
                <input type="date" value={item.issueDate} onChange={(event) => updateCertification(index, "issueDate", event.target.value)} className={inputClass(false)} />
                <input type="date" value={item.expiryDate} onChange={(event) => updateCertification(index, "expiryDate", event.target.value)} className={inputClass(false)} />
                <input value={item.credentialId} onChange={(event) => updateCertification(index, "credentialId", event.target.value)} placeholder="Credential ID" className={inputClass(false)} />
                <input type="url" value={item.credentialUrl} onChange={(event) => updateCertification(index, "credentialUrl", event.target.value)} placeholder="Credential URL" className={inputClass(false)} />
              </div>
            </div>
          ))}
          {!form.certifications.length ? <p className="text-sm text-gray-400 italic">No certifications added.</p> : null}
        </div>
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
          <Field label="Portfolio" error={errors.portfolio}>
            <input name="portfolio" type="url" value={form.portfolio} onChange={handleChange} placeholder="https://..." className={inputClass(errors.portfolio)} />
          </Field>
          <Field label="Twitter / X" error={errors.twitter}>
            <input name="twitter" type="url" value={form.twitter} onChange={handleChange} placeholder="https://x.com/..." className={inputClass(errors.twitter)} />
          </Field>
          <Field label="Website" error={errors.website}>
            <input name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://..." className={inputClass(errors.website)} />
          </Field>
          <Field label="Resume URL" error={errors.resumeUrl}>
            <input name="resumeUrl" type="url" value={form.resumeUrl} onChange={handleChange} placeholder="https://.../resume.pdf" className={inputClass(errors.resumeUrl)} />
          </Field>
        </div>
        <p className="mt-2 text-xs text-gray-400">The existing profile API stores resume URLs and metadata. This form does not introduce a second upload or storage mechanism.</p>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Documents</h2>
            <p className="text-xs text-gray-400 mt-1">Store links to documents already hosted by an approved storage provider.</p>
          </div>
          <button
            type="button"
            onClick={() => setForm((previous) => ({ ...previous, documents: [...previous.documents, newDocument()] }))}
            className="px-3 py-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-lg"
          >
            Add document
          </button>
        </div>
        {errors.documents ? <p className="text-xs text-red-500 mb-3">{errors.documents}</p> : null}
        <div className="space-y-4">
          {form.documents.map((item, index) => (
            <div key={`document-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex justify-between items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-gray-500">Document {index + 1}</span>
                <button
                  type="button"
                  onClick={() => setFormArray("documents", form.documents.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={item.documentType} onChange={(event) => updateDocument(index, "documentType", event.target.value)} placeholder="Document type" className={inputClass(false)} />
                <input value={item.documentName} onChange={(event) => updateDocument(index, "documentName", event.target.value)} placeholder="Document name" className={inputClass(false)} />
                <input value={item.fileName} onChange={(event) => updateDocument(index, "fileName", event.target.value)} placeholder="File name" className={inputClass(false)} />
                <input type="url" value={item.documentUrl} onChange={(event) => updateDocument(index, "documentUrl", event.target.value)} placeholder="https://..." className={inputClass(false)} />
                <input type="number" min="0" value={item.fileSize} onChange={(event) => updateDocument(index, "fileSize", event.target.value)} placeholder="File size (bytes)" className={inputClass(false)} />
                <input value={item.mimeType} onChange={(event) => updateDocument(index, "mimeType", event.target.value)} placeholder="MIME type" className={inputClass(false)} />
              </div>
            </div>
          ))}
          {!form.documents.length ? <p className="text-sm text-gray-400 italic">No documents added.</p> : null}
        </div>
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
