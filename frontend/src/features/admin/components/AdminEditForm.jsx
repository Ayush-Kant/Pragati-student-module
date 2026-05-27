import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BasicInformation from "./BasicInformation";
import ProfessionalProfile from "./ProfessionalProfile";
import ExperienceExpertise from "./ExperienceExpertise";
import Availability from "./Availability";
import ProfileStepper from "./ProfileStepper";

const profileSchema = z.object({
  fullName: z
    .string()
    .nonempty("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  displayTitle: z
    .string()
    .nonempty("Display title is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email"),
  bio: z.string().max(200, "Max 200 characters").optional().or(z.literal("")),
  bio2: z.string().max(500, "Max 500 characters").optional().or(z.literal("")),
  avatarUrl: z.string().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),
  yearsExp: z.string().optional().or(z.literal("")),
  expertise: z.array(z.string()).optional(),
  coreSkills: z.array(
    z.object({
      name: z.string(),
      level: z.string(),
    })
  ).optional(),
  availability: z.record(z.boolean()).optional(),
  certifications: z.array(
    z.object({
      name: z.string(),
      fileName: z.string(),
    })
  ).optional(),
});

const AdminEditForm = ({ profile, onSave, onCancel }) => {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      displayTitle: "",
      email: "",
      bio: "",
      bio2: "",
      avatarUrl: "",
      github: "",
      linkedin: "",
      designation: "",
      yearsExp: "",
      expertise: [],
      coreSkills: [],
      availability: {},
      certifications: [],
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || "",
        displayTitle: profile.displayTitle || "",
        email: profile.email || "",
        bio: profile.bio || "",
        bio2: profile.bio2 || "",
        avatarUrl: profile.avatarUrl || "",
        github: profile.socialLinks?.github || profile.github || "",
        linkedin: profile.socialLinks?.linkedin || profile.linkedin || "",
        designation: profile.designation || "",
        yearsExp: profile.yearsExp || "",
        expertise: profile.expertise || [],
        coreSkills: profile.coreSkills || [],
        availability: profile.availability || {},
        certifications: profile.certifications || [],
      });
    }
  }, [profile, reset]);

  const avatarUrl = watch("avatarUrl");
  const fullName = watch("fullName");

  // Step Navigators
  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Form submit callback
  const onSubmit = (data) => {
    const finalData = {
      ...profile,
      fullName: data.fullName,
      displayTitle: data.displayTitle,
      email: data.email,
      bio: data.bio,
      bio2: data.bio2,
      avatarUrl: data.avatarUrl,
      socialLinks: {
        github: data.github,
        linkedin: data.linkedin,
      },
      designation: data.designation,
      yearsExp: data.yearsExp,
      expertise: data.expertise,
      coreSkills: data.coreSkills,
      availability: data.availability,
      certifications: data.certifications,
    };
    onSave(finalData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ── TOP HEADER BAR ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 flex flex-col md:flex-row items-center justify-between gap-4 py-2">
          {/* Logo */}
          <div className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
            <span className="text-2xl">🎓</span>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl leading-none">
                <span className="text-amber-500">UPTO</span>
                <span className="text-emerald-500">SKILLS</span>
              </span>
              <span className="text-[8px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Transform Your Career Path
              </span>
            </div>
          </div>

          {/* Stepper (Only steps 1–3) */}
          {step < 4 ? (
            <div className="flex-1 md:flex justify-center">
              <ProfileStepper step={step} />
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-500 bg-slate-100/80 px-4 py-1.5 rounded-full">
              Almost Finished! 🎉
            </div>
          )}
        </div>
      </div>

      {/* ── STEP 4 CUSTOM INNER BAR ── */}
      {step === 4 && (
        <div className="bg-white border-b border-slate-200 px-4 py-6 shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {fullName || "Pragati"}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5 mb-5">
              MENTOR ONBOARDING
            </p>
            <div className="max-w-xl mx-auto">
              <ProfileStepper step={step} />
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col justify-between">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Switcher */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
              {/* Left Column: Form Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <BasicInformation
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  avatarUrl={avatarUrl}
                  fullName={fullName}
                />
              </div>

              {/* Right Column: Sidebar */}
              <div className="space-y-6">
                {/* Quote Card */}
                <div className="bg-gradient-to-br from-[#f0fdf4] to-[#ede9fe] rounded-2xl p-6 relative overflow-hidden shadow-sm min-h-[220px]">
                  {/* Decorative shapes */}
                  <div className="absolute top-0 right-10 w-8 h-10 bg-teal-100 rounded-b-xl opacity-75" />
                  <div className="absolute top-0 right-4 w-6 h-8 bg-amber-100 rounded-b-lg opacity-75" />

                  {/* Bulb icon */}
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm mb-4">
                    💡
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800">Join the Bridge</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[190px]">
                    "Sharing your journey isn't just about technical advice; it's about building the confidence of the next generation of talent."
                  </p>

                  {/* Owl */}
                  <div className="absolute bottom-2 right-2 text-7xl select-none leading-none filter drop-shadow">
                    🦉
                  </div>
                </div>

                {/* Checklist Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4">Application Checklist</h3>
                  <div className="space-y-3.5">
                    {[
                      { label: "Basic Identity", checked: true },
                      { label: "Expertise & Socials", checked: false },
                      { label: "Experience Links", checked: false },
                      { label: "Office Hours", checked: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold ${
                            item.checked
                              ? "bg-violet-600 border-violet-600 text-white"
                              : "border-slate-300 bg-transparent text-transparent"
                          }`}
                        >
                          ✓
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            item.checked ? "text-violet-600" : "text-slate-400"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Link */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
                  <span>🎧</span>
                  <span>
                    Need help?{" "}
                    <a href="#" className="text-violet-600 font-bold hover:underline">
                      Contact Support
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <ProfessionalProfile
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            </div>
          )}

          {step === 3 && (
            <div className="max-w-3xl mx-auto">
              <ExperienceExpertise
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            </div>
          )}

          {step === 4 && (
            <div className="max-w-3xl mx-auto">
              <Availability watch={watch} setValue={setValue} />
            </div>
          )}

          {/* ── FOOTER WIZARD CONTROLS ── */}
          <div className="border-t border-slate-200 pt-5 flex items-center justify-between gap-4 max-w-3xl mx-auto w-full">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition px-2 py-3"
                >
                  Cancel Edit
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSave()}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition px-4 py-3"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow transition cursor-pointer"
                  >
                    Continue to Profile →
                  </button>
                </div>
              </>
            ) : step === 4 ? (
              <>
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-violet-200 hover:bg-violet-50 text-violet-600 text-xs font-bold px-6 py-3 rounded-full transition cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-7 py-3 rounded-full shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  Complete Registration
                  <span className="text-[10px]">✓</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold px-6 py-3 rounded-full transition cursor-pointer"
                >
                  ← Previous Step
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow transition cursor-pointer"
                >
                  {step === 2 ? "Continue to Experience →" : "Continue to Availability →"}
                </button>
              </>
            )}
          </div>

          {step > 1 && (
            <div className="text-center text-xs text-slate-400 py-2">
              Need help?{" "}
              <a href="#" className="text-violet-600 font-bold hover:underline">
                Contact Support
              </a>
              {step === 3 && (
                <p className="text-[10px] text-slate-300 mt-4 uppercase tracking-widest">
                  © 2024 UPTOSKILLS MENTORING PLATFORM
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminEditForm;
