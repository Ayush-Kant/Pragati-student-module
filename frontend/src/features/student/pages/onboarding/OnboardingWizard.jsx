import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import StepPersonalInfo from "./steps/StepPersonalInfo";
import StepAcademics from "./steps/StepAcademics";
import StepSkills from "./steps/StepSkills";
import { getOnboardingStateApi, saveOnboardingStepApi } from "../../../auth/services/studentAuth.services";

const EMPTY_FORM = {
  personal: { fullName: "", phone: "", dateOfBirth: "", gender: "", bio: "" },
  contact: { collegeId: "", city: "", state: "", country: "India", pincode: "" },
  academic: { institutionName: "", department: "", course: "", degree: "", semester: "", graduationYear: "", cgpa: "", admissionYear: "", academicEmail: "" },
  skills: [],
  social: { linkedinUrl: "", githubUrl: "" },
  resume: null,
  resumeName: "",
};

const stepTitles = ["Personal information", "Academic details", "Skills & social", "Resume upload"];

const errorText = (error) => error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";

const profileToForm = (profile) => {
  const p = profile || {};
  return {
    personal: {
      fullName: p.personal?.name || "",
      phone: p.personal?.phone || "",
      dateOfBirth: p.personal?.dateOfBirth || "",
      gender: p.personal?.gender || "",
      bio: p.personal?.bio || "",
    },
    contact: {
      collegeId: p.contact?.collegeId ?? p.collegeId ?? "",
      city: p.contact?.city || "",
      state: p.contact?.state || "",
      country: p.contact?.country || "India",
      pincode: p.contact?.pincode || "",
    },
    academic: {
      institutionName: p.academic?.institutionName || "",
      department: p.academic?.department || "",
      course: p.academic?.course || "",
      degree: p.academic?.degree || "",
      semester: p.academic?.semester ?? "",
      graduationYear: p.academic?.graduationYear ?? "",
      cgpa: p.academic?.cgpa ?? "",
      admissionYear: p.academic?.admissionYear ?? "",
      academicEmail: p.academic?.academicEmail || "",
    },
    skills: Array.isArray(p.skills) ? p.skills.map((skill) => skill.name || skill.skill_name).filter(Boolean) : [],
    social: {
      linkedinUrl: p.social?.linkedin || p.social?.linkedinUrl || "",
      githubUrl: p.social?.github || p.social?.githubUrl || "",
    },
    resume: null,
    resumeName: p.resume?.fileName || "",
  };
};

const validateStep = (step, form) => {
  const errors = {};

  if (step === 1) {
    const name = form.personal.fullName.trim();
    if (name.length < 2 || name.length > 80 || !/^[A-Za-z][A-Za-z\s.'-]*$/.test(name)) errors.fullName = "Name must be 2-80 characters.";
    if (form.personal.phone && !/^[0-9+()\-\s]{7,20}$/.test(form.personal.phone.trim())) errors.phone = "Enter a valid phone number.";
    if (!form.contact.city.trim()) errors.city = "City is required.";
    if (form.contact.collegeId && !/^\d+$/.test(String(form.contact.collegeId).trim())) errors.collegeId = "Enter a valid numeric College ID.";
  }

  if (step === 2) {
    if (!form.academic.department.trim()) errors.department = "Department is required.";
    if (form.academic.graduationYear !== "") {
      const year = Number(form.academic.graduationYear);
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(year) || year < currentYear - 1 || year > currentYear + 4) errors.graduationYear = "Invalid graduation year.";
    }
    if (form.academic.cgpa !== "") {
      const cgpa = Number(form.academic.cgpa);
      if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) errors.cgpa = "CGPA must be between 0 and 10.";
    }
  }

  if (step === 3 && form.skills.length > 20) errors.skills = "You can select at most 20 skills.";
  if (step === 4 && !form.resume) errors.resume = "Please upload your resume PDF.";

  return errors;
};

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const state = await getOnboardingStateApi();
        if (!mounted) return;
        const current = Number(state?.data?.currentStep || 1);
        if (Boolean(state?.data?.onboardingComplete) || current >= 4 && Number(state?.data?.profileCompleteness || 0) >= 100) {
          navigate("/student/dashboard", { replace: true });
          return;
        }
        setStep(Math.min(Math.max(current, 1), 4));
        setForm(profileToForm(state?.data?.profile));
      } catch (requestError) {
        if (mounted) setError(errorText(requestError));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const update = (section, changes) => {
    setForm((previous) => ({ ...previous, [section]: { ...previous[section], ...changes } }));
    setErrors({});
    setError("");
  };

  const saveStep = async () => {
    const validation = validateStep(step, form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return false;
    }

    setSaving(true);
    setError("");
    try {
      let payload;
      if (step === 1) {
        payload = {
          fullName: form.personal.fullName.trim(),
          phone: form.personal.phone.trim(),
          dateOfBirth: form.personal.dateOfBirth || null,
          gender: form.personal.gender || null,
          bio: form.personal.bio.trim(),
          collegeId: form.contact.collegeId === "" ? null : Number(form.contact.collegeId),
          city: form.contact.city.trim(),
          state: form.contact.state.trim(),
          country: form.contact.country.trim(),
          pincode: form.contact.pincode.trim(),
        };
      } else if (step === 2) {
        payload = {
          institutionName: form.academic.institutionName.trim(),
          department: form.academic.department.trim(),
          course: form.academic.course.trim(),
          degree: form.academic.degree.trim(),
          semester: form.academic.semester,
          graduationYear: form.academic.graduationYear,
          cgpa: form.academic.cgpa,
          admissionYear: form.academic.admissionYear,
          academicEmail: form.academic.academicEmail.trim(),
        };
      } else if (step === 3) {
        payload = {
          skills: form.skills,
          linkedinUrl: form.social.linkedinUrl.trim(),
          githubUrl: form.social.githubUrl.trim(),
        };
      } else {
        payload = new FormData();
        payload.append("resume", form.resume);
      }

      const result = await saveOnboardingStepApi(step, payload);
      const nextStep = Number(result?.data?.nextStep || step);

      if (step === 4) {
        toast.success("Onboarding completed");
        navigate("/student/dashboard", { replace: true });
      } else {
        setStep(Math.min(nextStep, 4));
        toast.success(`Step ${step} saved`);
      }

      return true;
    } catch (requestError) {
      setError(errorText(requestError));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const description = useMemo(() => [
    "Tell us about yourself so your student profile starts with the right identity and contact details.",
    "Add the academic information used throughout your student profile and career workflows.",
    "Add the skills and professional links you want companies and mentors to see.",
    "Upload a PDF resume. The server validates the file type and the 5 MB size limit before storing it.",
  ][step - 1], [step]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 text-sm text-slate-500">Loading onboarding…</div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-blue-600 uppercase">Student onboarding</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stepTitles[step - 1]}</h1>
          </div>
          <span className="text-xs font-bold text-slate-400">Step {step} / 4</span>
        </div>

        <p className="text-sm text-slate-500 mt-2">{description}</p>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-5"><div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} /></div>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="py-6 min-h-[360px]">
          {step === 1 && (
            <StepPersonalInfo
              personal={{ name: form.personal.fullName, phone: form.personal.phone, dateOfBirth: form.personal.dateOfBirth, gender: form.personal.gender, bio: form.personal.bio }}
              contact={form.contact}
              errors={{ name: errors.fullName, phone: errors.phone, city: errors.city, collegeId: errors.collegeId }}
              onPersonalChange={(changes) => update("personal", { ...changes, fullName: changes.name ?? form.personal.fullName })}
              onContactChange={(changes) => update("contact", changes)}
            />
          )}
          {step === 2 && <StepAcademics academic={form.academic} errors={errors} onChange={(changes) => update("academic", changes)} />}
          {step === 3 && (
            <div>
              <StepSkills skills={form.skills} onChange={(skills) => setForm((previous) => ({ ...previous, skills }))} />
              {errors.skills && <p className="mt-2 text-xs text-red-500">{errors.skills}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Field label="LinkedIn URL" value={form.social.linkedinUrl} onChange={(v) => update("social", { linkedinUrl: v })} placeholder="https://linkedin.com/in/…" />
                <Field label="GitHub URL" value={form.social.githubUrl} onChange={(v) => update("social", { githubUrl: v })} placeholder="https://github.com/…" />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
              <input id="resume" type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0] || null; setForm((previous) => ({ ...previous, resume: file, resumeName: file?.name || "" })); setErrors({}); setError(""); }} />
              <label htmlFor="resume" className="cursor-pointer inline-flex rounded-xl bg-blue-600 text-white px-5 py-3 font-bold text-sm hover:bg-blue-700">Choose PDF resume</label>
              <p className="mt-3 text-sm text-slate-500">PDF only · maximum 5 MB</p>
              {form.resumeName && <p className="mt-4 text-sm font-semibold text-slate-700">Selected: {form.resumeName}</p>}
              {errors.resume && <p className="mt-2 text-xs text-red-500">{errors.resume}</p>}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-5 flex gap-3">
          <button type="button" disabled={step === 1 || saving} onClick={() => { setErrors({}); setError(""); setStep((value) => Math.max(value - 1, 1)); }} className="w-1/3 rounded-xl border border-slate-200 py-3 font-bold text-sm text-slate-600 disabled:opacity-40">Back</button>
          <button type="button" disabled={saving} onClick={saveStep} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold text-sm disabled:opacity-60">{saving ? "Saving…" : step === 4 ? "Finish setup" : "Save & continue"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return <label className="block"><span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>;
}
