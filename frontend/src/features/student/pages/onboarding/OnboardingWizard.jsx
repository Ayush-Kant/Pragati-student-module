import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import StepPersonalInfo from "./steps/StepPersonalInfo";
import StepAcademics from "./steps/StepAcademics";
import StepSkills from "./steps/StepSkills";
import StepResume from "./steps/StepResume";
import studentProfileService from "../../services/studentProfile.service";

const INITIAL_FORM = {
  personal: {
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
  },
  contact: {
    city: "",
    state: "",
    country: "",
    pincode: "",
  },
  academic: {
    institutionName: "",
    department: "",
    course: "",
    degree: "",
    semester: "",
    cgpa: "",
    graduationYear: "",
    admissionYear: "",
    academicEmail: "",
  },
  skills: [],
  resumeUrl: "",
};

const stepTitles = ["Personal information", "Academic details", "Skills", "Resume"];

const errorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";

const numberOrNull = (value) => (value === "" ? null : Number(value));

const validateStep = (step, form) => {
  const errors = {};

  if (step === 1) {
    if (!form.personal.name.trim()) errors.name = "Name is required.";
    if (form.personal.phone && !/^[0-9+()\-\s]{7,20}$/.test(form.personal.phone.trim())) {
      errors.phone = "Enter a valid phone number.";
    }
    if (form.personal.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(form.personal.dateOfBirth)) {
      errors.dateOfBirth = "Use YYYY-MM-DD format.";
    }
    if (!form.contact.city.trim()) errors.city = "City is required.";
  }

  if (step === 2) {
    if (!form.academic.department.trim()) errors.department = "Department is required.";
    if (form.academic.semester !== "" && (Number(form.academic.semester) < 1 || Number(form.academic.semester) > 20)) {
      errors.semester = "Semester must be between 1 and 20.";
    }
    if (form.academic.cgpa !== "" && (Number(form.academic.cgpa) < 0 || Number(form.academic.cgpa) > 10)) {
      errors.cgpa = "CGPA must be between 0 and 10.";
    }
    if (form.academic.graduationYear !== "" && (Number(form.academic.graduationYear) < 1900 || Number(form.academic.graduationYear) > 2200)) {
      errors.graduationYear = "Enter a valid graduation year.";
    }
  }

  if (step === 4 && form.resumeUrl && !/^https?:\/\/\S+$/i.test(form.resumeUrl.trim())) {
    errors.resumeUrl = "Enter a valid HTTP(S) resume URL.";
  }

  return errors;
};

const mergeProfile = (profile) => {
  if (!profile) return INITIAL_FORM;

  return {
    personal: {
      ...INITIAL_FORM.personal,
      name: profile.personal?.name || "",
      phone: profile.personal?.phone || "",
      dateOfBirth: profile.personal?.dateOfBirth || "",
      gender: profile.personal?.gender || "",
      bio: profile.personal?.bio || "",
    },
    contact: {
      ...INITIAL_FORM.contact,
      city: profile.contact?.city || "",
      state: profile.contact?.state || "",
      country: profile.contact?.country || "",
      pincode: profile.contact?.pincode || "",
    },
    academic: {
      ...INITIAL_FORM.academic,
      institutionName: profile.academic?.institutionName || "",
      department: profile.academic?.department || "",
      course: profile.academic?.course || "",
      degree: profile.academic?.degree || "",
      semester: profile.academic?.semester ?? "",
      cgpa: profile.academic?.cgpa ?? "",
      graduationYear: profile.academic?.graduationYear ?? "",
      admissionYear: profile.academic?.admissionYear ?? "",
      academicEmail: profile.academic?.academicEmail || "",
    },
    skills: Array.isArray(profile.skills) ? profile.skills.map((skill) => skill.name).filter(Boolean) : [],
    resumeUrl: profile.resume?.url || "",
  };
};

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [stepErrors, setStepErrors] = useState({});

  const totalSteps = 4;

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await studentProfileService.getMyProfile();
        if (active) setForm(mergeProfile(response?.data));
      } catch (requestError) {
        if (active) setError(errorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  const updateSection = (section, changes) => {
    setForm((previous) => ({
      ...previous,
      [section]: { ...previous[section], ...changes },
    }));
    setStepErrors({});
    setError("");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepPersonalInfo
            personal={form.personal}
            contact={form.contact}
            errors={stepErrors}
            onPersonalChange={(changes) => updateSection("personal", changes)}
            onContactChange={(changes) => updateSection("contact", changes)}
          />
        );
      case 2:
        return (
          <StepAcademics
            academic={form.academic}
            errors={stepErrors}
            onChange={(changes) => updateSection("academic", changes)}
          />
        );
      case 3:
        return <StepSkills skills={form.skills} onChange={(skills) => { setForm((previous) => ({ ...previous, skills })); setStepErrors({}); }} />;
      case 4:
        return (
          <StepResume
            resumeUrl={form.resumeUrl}
            existingResumeName={form.resumeFileName}
            error={stepErrors.resumeUrl}
            onChange={(resumeUrl) => { setForm((previous) => ({ ...previous, resumeUrl })); setStepErrors({}); }}
          />
        );
      default:
        return null;
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await studentProfileService.updateProfile({
        personal: {
          ...form.personal,
          name: form.personal.name.trim(),
          phone: form.personal.phone.trim() || null,
          dateOfBirth: form.personal.dateOfBirth || null,
          gender: form.personal.gender || null,
          bio: form.personal.bio.trim() || null,
        },
        contact: {
          ...form.contact,
          city: form.contact.city.trim() || null,
          state: form.contact.state.trim() || null,
          country: form.contact.country.trim() || null,
          pincode: form.contact.pincode.trim() || null,
        },
        academic: {
          ...form.academic,
          institutionName: form.academic.institutionName.trim() || null,
          department: form.academic.department.trim() || null,
          course: form.academic.course.trim() || null,
          degree: form.academic.degree.trim() || null,
          semester: numberOrNull(form.academic.semester),
          cgpa: numberOrNull(form.academic.cgpa),
          graduationYear: numberOrNull(form.academic.graduationYear),
          admissionYear: numberOrNull(form.academic.admissionYear),
          academicEmail: form.academic.academicEmail.trim() || null,
        },
        skills: form.skills.map((name) => ({ name })),
        resume: form.resumeUrl.trim()
          ? {
              url: form.resumeUrl.trim(),
              fileName: null,
              fileSize: null,
              mimeType: null,
            }
          : null,
      });

      const savedProfile = response?.data;
      if (savedProfile) setForm(mergeProfile(savedProfile));
      navigate("/student/profile", { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    const errors = validateStep(currentStep, form);
    if (Object.keys(errors).length) {
      setStepErrors(errors);
      return;
    }

    setStepErrors({});
    setError("");

    if (currentStep === totalSteps) {
      await saveProfile();
      return;
    }

    setCurrentStep((step) => step + 1);
  };

  const handleBack = () => {
    setError("");
    setStepErrors({});
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const stepDescription = useMemo(
    () => [
      "Tell us about yourself.",
      "Add the academic information used across your student profile.",
      "Choose the skills you want associated with your student account.",
      "Attach your existing resume URL to your profile.",
    ][currentStep - 1],
    [currentStep],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
          <p className="mt-4 text-sm text-slate-500">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-100/70 border border-slate-100 p-5 sm:p-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Onboarding
          </span>
          <p className="text-xs font-medium text-slate-400">
            Step <span className="text-slate-700 font-bold">{currentStep}</span> of {totalSteps}
          </p>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
          {stepTitles[currentStep - 1]}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{stepDescription}</p>

        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: progressWidth }} />
        </div>

        {error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <div className="min-h-[330px] my-6 py-2">
          {renderStep()}
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-4">
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
              <div
                key={step}
                className={`rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? "w-5 h-2 bg-blue-600"
                    : step < currentStep
                      ? "w-2 h-2 bg-blue-400"
                      : "w-2 h-2 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || saving}
              className="w-1/2 px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="w-1/2 px-5 py-2.5 rounded-xl font-medium text-sm text-center text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Saving..." : currentStep === totalSteps ? "Finish setup" : "Next"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student/profile")}
            disabled={saving}
            className="w-full text-xs font-medium text-slate-400 hover:text-slate-600 disabled:opacity-40"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
