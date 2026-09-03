import { useCallback, useEffect, useMemo, useState } from "react";
import { Award, BookOpen, Check, FileText, GraduationCap, Link as LinkIcon, Loader2, MapPin, Pencil, User } from "lucide-react";
import ProfileEditForm from "../../components/profile/ProfileEditForm";
import studentProfileService from "../../services/studentProfile.service";

const EMPTY_PROFILE = {
  personal: { name: "", email: "", phone: "", profileImage: null, avatarUrl: null, bio: null, gender: null, dateOfBirth: null },
  contact: { address: null, addressLine1: null, addressLine2: null, city: null, state: null, country: "India", pincode: null, alternatePhone: null, alternateEmail: null },
  academic: { enrollmentNo: null, enrollmentNumber: null, institutionName: null, department: null, course: null, degree: null, semester: null, batch: null, graduationYear: null, admissionYear: null, cgpa: null, academicEmail: null, tenthPercentage: null, twelfthPercentage: null, backlogs: null, activeBacklogs: null },
  skills: [], certifications: [], documents: [], resume: null, social: {}, profileCompleteness: 0,
};

const clone = (value) => JSON.parse(JSON.stringify(value ?? EMPTY_PROFILE));
const apiError = (error) => error?.response?.data?.message || error?.message || "Something went wrong.";
const initials = (name) => String(name || "Student").trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== "";
const completion = (profile) => {
  const p = profile?.personal || {};
  const c = profile?.contact || {};
  const a = profile?.academic || {};
  const s = profile?.social || {};
  const steps = [
    ["Personal", Boolean(p.name && p.phone && p.dateOfBirth)],
    ["Contact & address", Boolean(c.addressLine1 && c.city && c.state && c.pincode)],
    ["Academic", Boolean(a.institutionName && a.course && a.semester !== null && a.semester !== "" && a.cgpa !== null && a.cgpa !== "")],
    ["Skills", Array.isArray(profile?.skills) && profile.skills.length > 0],
    ["Resume", Boolean(profile?.resume)],
    ["Social", Object.values(s).some(Boolean)],
  ];
  return { steps, percent: Math.round((steps.filter((step) => step[1]).length / steps.length) * 100) };
};

function Value({ label, value }) { return <div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm font-medium text-slate-800">{hasValue(value) ? value : <span className="italic text-slate-400">Not provided</span>}</div></div>; }
function Card({ icon: Icon, title, subtitle, children }) { return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-4 w-4" /></div><div><h2 className="text-sm font-bold text-slate-900">{title}</h2><p className="text-xs text-slate-500">{subtitle}</p></div></div><div className="p-5">{children}</div></section>; }

export default function SM02ProfileWorkspace() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await studentProfileService.getMyProfile();
      setProfile({ ...EMPTY_PROFILE, ...(data || {}) });
    } catch (error) {
      setError(apiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const stats = useMemo(() => completion(profile), [profile]);
  const personal = profile.personal || EMPTY_PROFILE.personal;
  const contact = profile.contact || EMPTY_PROFILE.contact;
  const academic = profile.academic || EMPTY_PROFILE.academic;
  const social = profile.social || {};

  const saveProfile = async (payload) => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const updated = await studentProfileService.updateProfile(payload);
      setProfile({ ...EMPTY_PROFILE, ...(updated || {}) });
      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError(apiError(error));
      throw error;
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-full bg-slate-50 p-6"><div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-48 rounded-3xl bg-white" /><div className="h-20 rounded-2xl bg-white" /><div className="h-80 rounded-2xl bg-white" /></div></div>;

  if (editing) return <div className="min-h-full bg-slate-50 px-3 py-5 sm:px-5 lg:px-8"><div className="mx-auto max-w-6xl"><div className="mb-5 flex items-center justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">SM-02</div><h1 className="mt-1 text-2xl font-black text-slate-900">Edit Student Profile</h1><p className="mt-1 text-sm text-slate-500">Update personal, academic, skills, certification, social and document information.</p></div><button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button></div>{error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><ProfileEditForm profile={profile} onSave={saveProfile} onCancel={() => setEditing(false)} saving={saving} /></div></div></div>;

  return <div className="min-h-full bg-slate-50 px-3 py-5 sm:px-5 lg:px-8"><div className="mx-auto max-w-6xl space-y-5">
    <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-lg sm:p-7"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-4"><div className="shrink-0">{personal.profileImage || personal.avatarUrl ? <img src={personal.profileImage || personal.avatarUrl} alt={personal.name || "Student"} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/20" /> : <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black ring-4 ring-white/10">{initials(personal.name)}</div>}</div><div><div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Student profile • SM-02</div><h1 className="mt-1 text-2xl font-black sm:text-3xl">{personal.name || "Complete your profile"}</h1><p className="mt-1 text-sm text-blue-100">{personal.email || "Add your account details"}</p><div className="mt-3 flex flex-wrap gap-2 text-xs">{academic.course ? <span className="rounded-full bg-white/10 px-3 py-1">{academic.course}</span> : null}{academic.department ? <span className="rounded-full bg-white/10 px-3 py-1">{academic.department}</span> : null}{academic.batch ? <span className="rounded-full bg-white/10 px-3 py-1">Batch {academic.batch}</span> : null}</div></div></div><button type="button" onClick={() => { setError(""); setSuccess(""); setEditing(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-50"><Pencil className="h-4 w-4" />Edit profile</button></div></header>

    {error ? <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button type="button" onClick={loadProfile} className="font-semibold underline">Retry</button></div> : null}
    {success ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</div> : null}

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><div className="text-sm font-bold text-slate-900">Profile completeness</div><p className="mt-1 text-xs text-slate-500">Complete the required sections to maintain a placement-ready student profile.</p></div><div className="text-3xl font-black text-slate-900">{stats.percent}%</div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${stats.percent}%` }} /></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{stats.steps.map(([label, completeStep]) => <button key={label} type="button" onClick={() => document.getElementById(`sm02-${label.replace(/\\W+/g, "-").toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-600"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${completeStep ? "bg-emerald-100 text-emerald-600" : "bg-white text-slate-300"}`}>{completeStep ? <Check className="h-3 w-3" /> : null}</span>{label}</button>)}</div></section>

    <div className="grid gap-5 lg:grid-cols-2">
      <div id="sm02-personal"><Card icon={User} title="Personal information" subtitle="Identity and professional summary."><div className="grid gap-5 sm:grid-cols-2"><Value label="Full name" value={personal.name} /><Value label="Email" value={personal.email} /><Value label="Phone" value={personal.phone} /><Value label="Date of birth" value={personal.dateOfBirth} /><Value label="Gender" value={personal.gender} /></div>{personal.bio ? <div className="mt-5 rounded-xl bg-slate-50 p-4"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Bio</div><p className="mt-2 text-sm leading-6 text-slate-600">{personal.bio}</p></div> : null}</Card></div>
      <div id="sm02-contact--address"><Card icon={MapPin} title="Contact & address" subtitle="Current contact and location details."><div className="grid gap-5 sm:grid-cols-2"><Value label="Address" value={contact.addressLine1 || contact.address} /><Value label="Address line 2" value={contact.addressLine2} /><Value label="City" value={contact.city} /><Value label="State" value={contact.state} /><Value label="Country" value={contact.country} /><Value label="Pincode" value={contact.pincode} /><Value label="Alternate phone" value={contact.alternatePhone} /><Value label="Alternate email" value={contact.alternateEmail} /></div></Card></div>
      <div id="sm02-academics"><Card icon={GraduationCap} title="Academic information" subtitle="Institution, enrollment and performance."><div className="grid gap-5 sm:grid-cols-2"><Value label="Institution" value={academic.institutionName} /><Value label="Department" value={academic.department} /><Value label="Course" value={academic.course} /><Value label="Degree" value={academic.degree} /><Value label="Enrollment" value={academic.enrollmentNumber || academic.enrollmentNo} /><Value label="Semester" value={academic.semester} /><Value label="Batch" value={academic.batch} /><Value label="CGPA" value={academic.cgpa} /><Value label="Graduation year" value={academic.graduationYear} /><Value label="10th percentage" value={academic.tenthPercentage} /><Value label="12th percentage" value={academic.twelfthPercentage} /><Value label="Active backlogs" value={academic.activeBacklogs} /></div></Card></div>
      <div id="sm02-skills"><Card icon={BookOpen} title="Skills" subtitle="Technical and professional capability.">{profile.skills?.length ? <div className="flex flex-wrap gap-2">{profile.skills.map((skill) => <div key={skill.id || `${skill.name}-${skill.category || ""}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><div className="text-sm font-bold text-slate-800">{skill.name}</div>{skill.level || skill.category ? <div className="mt-1 text-[11px] text-slate-500">{[skill.level, skill.category].filter(Boolean).join(" • ")}</div> : null}</div>)}</div> : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">No skills added yet.</div>}</Card></div>
      <div id="sm02-certifications"><Card icon={Award} title="Certifications" subtitle="Credentials and verified achievements.">{profile.certifications?.length ? <div className="space-y-3">{profile.certifications.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 p-4"><div className="font-bold text-slate-800">{item.name}</div><div className="mt-1 text-sm text-slate-500">{item.issuingOrganization || "Issuing organization not provided"}</div>{item.credentialUrl ? <a className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline" href={item.credentialUrl} target="_blank" rel="noreferrer">View credential</a> : null}</div>)}</div> : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">No certifications added yet.</div>}</Card></div>
      <div id="sm02-resume--documents"><Card icon={FileText} title="Resume & documents" subtitle="Placement-ready documents and resume.">{profile.resume ? <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4"><div><div className="font-bold text-emerald-900">{profile.resume.fileName || "Resume"}</div><div className="text-xs text-emerald-700">{profile.resume.mimeType || "Resume document"}</div></div>{profile.resume.url ? <a href={profile.resume.url} target="_blank" rel="noreferrer" className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-emerald-700">Open</a> : null}</div> : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">No resume linked yet. Use the existing onboarding upload or add a resume URL from Edit Profile.</div>}{profile.documents?.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{profile.documents.map((doc) => <a key={doc.id} href={doc.documentUrl || "#"} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40"><div className="font-bold text-slate-800">{doc.documentName || doc.fileName || "Document"}</div><div className="mt-1 text-xs text-slate-500">{doc.documentType || "Supporting document"}</div></a>)}</div> : null}</Card></div>
      <div id="sm02-social--profiles" className="lg:col-span-2"><Card icon={LinkIcon} title="Social profiles" subtitle="Professional links shared with mentors and recruiters."><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[["LinkedIn", social.linkedin], ["GitHub", social.github], ["Portfolio", social.portfolio], ["Twitter / X", social.twitter], ["Website", social.website]].map(([label, url]) => url ? <a key={label} href={url} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40"><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><LinkIcon className="h-4 w-4 text-blue-600" />{label}</div><div className="mt-2 truncate text-xs text-blue-600">{url}</div></a> : null)}{!Object.values(social).some(Boolean) ? <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">No social profile links added yet.</div> : null}</div></Card></div>
    </div>
  </div></div>;
}
