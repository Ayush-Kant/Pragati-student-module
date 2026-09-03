import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  ExternalLink,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Link as LinkIcon,
  Linkedin,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import studentProfileService from "../../services/studentProfile.service";

const EMPTY = {
  studentId: null,
  userId: null,
  collegeId: null,
  personal: { name: "", email: "", phone: "", profileImage: "", avatarUrl: "", bio: "", gender: "", dateOfBirth: "" },
  contact: { address: "", addressLine1: "", addressLine2: "", city: "", state: "", country: "India", pincode: "", alternatePhone: "", alternateEmail: "" },
  academic: { enrollmentNo: "", enrollmentNumber: "", institutionName: "", department: "", course: "", degree: "", semester: "", batch: "", graduationYear: "", admissionYear: "", cgpa: "", academicEmail: "", tenthPercentage: "", twelfthPercentage: "", backlogs: "", activeBacklogs: "" },
  skills: [],
  resume: null,
  certifications: [],
  social: { linkedin: "", github: "", portfolio: "", twitter: "", website: "" },
  documents: [],
  profileCompleteness: 0,
};

const SECTION_META = [
  ["personal", "Personal", User],
  ["contact", "Contact & Address", MapPin],
  ["academic", "Academics", GraduationCap],
  ["skills", "Skills", BookOpen],
  ["certifications", "Certifications", Award],
  ["documents", "Resume & Documents", FileText],
  ["social", "Social Profiles", LinkIcon],
];

const clone = (value) => JSON.parse(JSON.stringify(value ?? EMPTY));
const errMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;
const clean = (value) => (typeof value === "string" ? value.trim() : value);
const urlOk = (value) => !value || /^https?:\/\/\S+$/i.test(value);
const numberOrNull = (value) => (value === "" || value === null || value === undefined ? null : Number(value));

const initialsFor = (name) => (String(name || "Student").trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "ST");
const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined || bytes === "") return "";
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const completionSteps = (profile) => {
  const p = profile?.personal || {};
  const c = profile?.contact || {};
  const a = profile?.academic || {};
  const social = profile?.social || {};
  return [
    { id: "personal", label: "Personal information", complete: Boolean(p.name && p.phone && p.dateOfBirth), required: true },
    { id: "contact", label: "Contact & address", complete: Boolean(c.addressLine1 && c.city && c.state && c.pincode), required: true },
    { id: "academic", label: "Academic information", complete: Boolean(a.institutionName && a.course && a.semester !== "" && a.cgpa !== ""), required: true },
    { id: "skills", label: "Skills", complete: Array.isArray(profile?.skills) && profile.skills.length > 0, required: true },
    { id: "certifications", label: "Certifications", complete: Array.isArray(profile?.certifications) && profile.certifications.length > 0, required: false },
    { id: "documents", label: "Resume / documents", complete: Boolean(profile?.resume || profile?.documents?.length), required: true },
    { id: "social", label: "Social profile", complete: Object.values(social).some(Boolean), required: false },
  ];
};

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.75 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
const mutedClass = "rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500";

function Field({ label, value, onChange, type = "text", placeholder, disabled = false, min, max, step }) {
  return (
    <label className="space-y-1.5 block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input className={`${inputClass} ${disabled ? "bg-slate-50 text-slate-500" : ""}`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} disabled={disabled} min={min} max={max} step={step} />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 4, placeholder }) {
  return (
    <label className="space-y-1.5 block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <textarea className={`${inputClass} resize-y`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
    </label>
  );
}

function EmptyValue({ text = "Not provided" }) { return <span className="text-slate-400 italic">{text}</span>; }
function Info({ label, value }) { return <div><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm font-medium text-slate-800">{value === null || value === undefined || value === "" ? <EmptyValue /> : value}</div></div>; }

function Card({ title, subtitle, icon: Icon, children, action }) {
  return <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"><div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-4.5 w-4.5" /></div><div><h2 className="text-sm font-bold text-slate-900">{title}</h2>{subtitle ? <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p> : null}</div></div>{action}</div><div className="p-5">{children}</div></section>;
}

function SaveBar({ saving, onSave, onCancel }) {
  return <div className="sticky bottom-4 z-20 flex items-center justify-end gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur"><button type="button" onClick={onCancel} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><X className="mr-1.5 inline h-4 w-4" />Cancel</button><button type="button" onClick={onSave} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? <Loader2 className="mr-1.5 inline h-4 w-4 animate-spin" /> : <Save className="mr-1.5 inline h-4 w-4" />}Save changes</button></div>;
}

export default function SM02ProfilePage() {
  const [profile, setProfile] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("personal");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await studentProfileService.getMyProfile();
      setProfile({ ...EMPTY, ...clone(data || {}) });
    } catch (error) {
      setMessage({ type: "error", text: errMessage(error, "Unable to load your profile.") });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const steps = useMemo(() => completionSteps(profile), [profile]);
  const computedCompletion = Math.round((steps.filter((step) => step.complete).length / steps.length) * 100);
  const completeness = Math.max(0, Math.min(100, Number(profile.profileCompleteness || computedCompletion)));

  const beginEdit = (section) => {
    setMessage(null);
    setEditing(section);
    setDraft(clone(profile?.[section]));
  };

  const cancelEdit = () => { setEditing(null); setDraft(null); setMessage(null); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage(null);
    try {
      let response;
      if (editing === "personal") response = await studentProfileService.updatePersonal({ ...draft, name: clean(draft.name), bio: clean(draft.bio) || null, phone: clean(draft.phone) || null, dateOfBirth: draft.dateOfBirth || null, gender: clean(draft.gender) || null, profileImage: clean(draft.profileImage) || null, avatarUrl: clean(draft.avatarUrl) || null });
      if (editing === "contact") response = await studentProfileService.updateContact({ ...draft, address: clean(draft.address) || null, addressLine1: clean(draft.addressLine1) || null, addressLine2: clean(draft.addressLine2) || null, city: clean(draft.city) || null, state: clean(draft.state) || null, country: clean(draft.country) || null, pincode: clean(draft.pincode) || null, alternatePhone: clean(draft.alternatePhone) || null, alternateEmail: clean(draft.alternateEmail) || null });
      if (editing === "academic") response = await studentProfileService.updateAcademic({ ...draft, semester: numberOrNull(draft.semester), graduationYear: numberOrNull(draft.graduationYear), admissionYear: numberOrNull(draft.admissionYear), cgpa: numberOrNull(draft.cgpa), tenthPercentage: numberOrNull(draft.tenthPercentage), twelfthPercentage: numberOrNull(draft.twelfthPercentage), backlogs: numberOrNull(draft.backlogs), activeBacklogs: numberOrNull(draft.activeBacklogs) });
      if (editing === "skills") response = await studentProfileService.updateSkills({ skills: (draft || []).filter((item) => clean(item?.name)).map((item) => ({ name: clean(item.name), level: clean(item.level) || null, category: clean(item.category) || null })) });
      if (editing === "certifications") response = await studentProfileService.updateCertifications({ certifications: (draft || []).filter((item) => clean(item?.name)).map((item) => ({ name: clean(item.name), issuingOrganization: clean(item.issuingOrganization) || null, issueDate: item.issueDate || null, expiryDate: item.expiryDate || null, credentialId: clean(item.credentialId) || null, credentialUrl: clean(item.credentialUrl) || null })) });
      if (editing === "social") {
        const values = { linkedin: clean(draft.linkedin) || null, github: clean(draft.github) || null, portfolio: clean(draft.portfolio) || null, twitter: clean(draft.twitter) || null, website: clean(draft.website) || null };
        if (Object.values(values).some((value) => !urlOk(value))) throw new Error("Social links must use valid HTTP(S) URLs.");
        response = await studentProfileService.updateSocial(values);
      }
      if (editing === "documents") {
        if (draft.resumeUrl && !urlOk(draft.resumeUrl)) throw new Error("Resume URL must use HTTP(S).");
        response = await studentProfileService.updateResume(draft.resumeUrl ? { url: draft.resumeUrl.trim(), fileName: profile.resume?.fileName || null, fileSize: profile.resume?.fileSize ?? null, mimeType: profile.resume?.mimeType || null } : null).catch(() => null);
        await studentProfileService.updateDocuments({ documents: (draft.documents || []).filter((item) => clean(item?.documentUrl)).map((item) => ({ ...item, documentUrl: clean(item.documentUrl) })) });
      }
      // Section endpoints may return the updated section or no wrapper; reload guarantees a coherent merged profile.
      await load();
      setEditing(null); setDraft(null);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setMessage({ type: "error", text: errMessage(error, "Unable to save this section.") });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-40 rounded-3xl bg-white" /><div className="h-16 rounded-2xl bg-white" /><div className="h-96 rounded-2xl bg-white" /></div></div>;

  const personal = profile.personal || EMPTY.personal;
  const academic = profile.academic || EMPTY.academic;
  const contact = profile.contact || EMPTY.contact;
  const social = profile.social || EMPTY.social;

  return <div className="min-h-full bg-slate-50 px-3 py-5 sm:px-5 lg:px-8">
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-lg sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              {personal.profileImage || personal.avatarUrl ? <img src={personal.profileImage || personal.avatarUrl} alt={personal.name || "Student"} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/20" /> : <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black ring-4 ring-white/10">{initialsFor(personal.name)}</div>}
            </div>
            <div><div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Student profile</div><h1 className="text-2xl font-black tracking-tight sm:text-3xl">{personal.name || "Complete your profile"}</h1><div className="mt-2 flex flex-wrap gap-2 text-xs text-blue-50"><span className="rounded-full bg-white/10 px-3 py-1">{personal.email || "Email not available"}</span>{academic.department ? <span className="rounded-full bg-white/10 px-3 py-1">{academic.department}</span> : null}{academic.batch ? <span className="rounded-full bg-white/10 px-3 py-1">Batch {academic.batch}</span> : null}</div></div>
          </div>
          <div className="min-w-[220px] rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-end justify-between"><div><div className="text-xs font-semibold text-blue-100">Profile completion</div><div className="mt-1 text-3xl font-black">{completeness}%</div></div><Check className="h-6 w-6 text-blue-100" /></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${completeness}%` }} /></div>
          </div>
        </div>
      </div>

      {message ? <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${message.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{message.text}</div> : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="px-3 py-3"><div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Profile sections</div><div className="mt-1 text-sm text-slate-500">Build a complete student identity.</div></div>
            <div className="space-y-1">
              {SECTION_META.map(([id, label, Icon]) => { const step = steps.find((item) => item.id === id); return <button key={id} type="button" onClick={() => setActive(id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active === id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${active === id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}><Icon className="h-4 w-4" /></div><span className="min-w-0 flex-1 text-sm font-semibold">{label}</span>{step?.complete ? <Check className="h-4 w-4 text-emerald-500" /> : <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />}</button>; })}
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-sm font-bold text-slate-900">Completion checklist</div><div className="mt-3 space-y-2">{steps.map((step) => <button key={step.id} type="button" onClick={() => setActive(step.id)} className="flex w-full items-center gap-2 text-left text-xs"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${step.complete ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>{step.complete ? <Check className="h-3 w-3" /> : null}</span><span className={step.complete ? "text-slate-700" : "text-slate-500"}>{step.label}</span>{step.required && !step.complete ? <span className="ml-auto text-[10px] font-semibold text-amber-600">Required</span> : null}</button>)}</div></div>
        </aside>

        <main className="min-w-0 space-y-5">
          {active === "personal" && <Card title="Personal information" subtitle="Your identity and professional introduction." icon={User} action={<button onClick={() => beginEdit("personal")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Pencil className="mr-1.5 inline h-3.5 w-3.5" />Edit</button>}>
            {editing === "personal" ? <div className="space-y-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Full name" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} /><Field label="Phone" value={draft.phone} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} /><Field label="Date of birth" value={draft.dateOfBirth} onChange={(v) => setDraft((d) => ({ ...d, dateOfBirth: v }))} type="date" /><Field label="Gender" value={draft.gender} onChange={(v) => setDraft((d) => ({ ...d, gender: v }))} placeholder="e.g. Male, Female, Other" /><Field label="Profile image URL" value={draft.profileImage || draft.avatarUrl} onChange={(v) => setDraft((d) => ({ ...d, profileImage: v, avatarUrl: v }))} /><Field label="Email" value={personal.email} onChange={() => {}} disabled /></div><Textarea label="Bio" value={draft.bio} onChange={(v) => setDraft((d) => ({ ...d, bio: v }))} placeholder="Tell mentors and recruiters about yourself." /><SaveBar saving={saving} onSave={save} onCancel={cancelEdit} /></div> : <><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Info label="Email" value={personal.email} /><Info label="Phone" value={personal.phone} /><Info label="Date of birth" value={personal.dateOfBirth} /><Info label="Gender" value={personal.gender} /></div><div className="mt-6 rounded-2xl bg-slate-50 p-4"><div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Bio</div><p className="mt-2 text-sm leading-6 text-slate-600">{personal.bio || <EmptyValue text="Add a short introduction to strengthen your profile." />}</p></div></>}
          </Card>}

          {active === "contact" && <Card title="Contact & address" subtitle="Contact details and current location." icon={MapPin} action={<button onClick={() => beginEdit("contact")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Pencil className="mr-1.5 inline h-3.5 w-3.5" />Edit</button>}>
            {editing === "contact" ? <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Address line 1" value={draft.addressLine1} onChange={(v) => setDraft((d) => ({ ...d, addressLine1: v }))} /><Field label="Address line 2" value={draft.addressLine2} onChange={(v) => setDraft((d) => ({ ...d, addressLine2: v }))} /><Field label="City" value={draft.city} onChange={(v) => setDraft((d) => ({ ...d, city: v }))} /><Field label="State" value={draft.state} onChange={(v) => setDraft((d) => ({ ...d, state: v }))} /><Field label="Country" value={draft.country} onChange={(v) => setDraft((d) => ({ ...d, country: v }))} /><Field label="Pincode" value={draft.pincode} onChange={(v) => setDraft((d) => ({ ...d, pincode: v }))} /><Field label="Alternate phone" value={draft.alternatePhone} onChange={(v) => setDraft((d) => ({ ...d, alternatePhone: v }))} /><Field label="Alternate email" value={draft.alternateEmail} onChange={(v) => setDraft((d) => ({ ...d, alternateEmail: v }))} /></div><SaveBar saving={saving} onSave={save} onCancel={cancelEdit} /></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Info label="Address" value={contact.addressLine1 || contact.address} /><Info label="Address line 2" value={contact.addressLine2} /><Info label="City" value={contact.city} /><Info label="State" value={contact.state} /><Info label="Country" value={contact.country} /><Info label="Pincode" value={contact.pincode} /><Info label="Alternate phone" value={contact.alternatePhone} /><Info label="Alternate email" value={contact.alternateEmail} /></div>}
          </Card>}

          {active === "academic" && <Card title="Academic information" subtitle="Education, enrollment and academic performance." icon={GraduationCap} action={<button onClick={() => beginEdit("academic")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Pencil className="mr-1.5 inline h-3.5 w-3.5" />Edit</button>}>
            {editing === "academic" ? <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Institution" value={draft.institutionName} onChange={(v) => setDraft((d) => ({ ...d, institutionName: v }))} /><Field label="Department / branch" value={draft.department} onChange={(v) => setDraft((d) => ({ ...d, department: v }))} /><Field label="Course" value={draft.course} onChange={(v) => setDraft((d) => ({ ...d, course: v }))} /><Field label="Degree" value={draft.degree} onChange={(v) => setDraft((d) => ({ ...d, degree: v }))} /><Field label="Enrollment number" value={draft.enrollmentNumber || draft.enrollmentNo} onChange={(v) => setDraft((d) => ({ ...d, enrollmentNumber: v, enrollmentNo: v }))} /><Field label="Academic email" value={draft.academicEmail} onChange={(v) => setDraft((d) => ({ ...d, academicEmail: v }))} /><Field label="Semester" value={draft.semester} onChange={(v) => setDraft((d) => ({ ...d, semester: v }))} type="number" min="1" max="20" /><Field label="Batch" value={draft.batch} onChange={(v) => setDraft((d) => ({ ...d, batch: v }))} /><Field label="Admission year" value={draft.admissionYear} onChange={(v) => setDraft((d) => ({ ...d, admissionYear: v }))} type="number" min="1900" max="2200" /><Field label="Graduation year" value={draft.graduationYear} onChange={(v) => setDraft((d) => ({ ...d, graduationYear: v }))} type="number" min="1900" max="2200" /><Field label="CGPA" value={draft.cgpa} onChange={(v) => setDraft((d) => ({ ...d, cgpa: v }))} type="number" min="0" max="10" step="0.01" /><Field label="10th percentage" value={draft.tenthPercentage} onChange={(v) => setDraft((d) => ({ ...d, tenthPercentage: v }))} type="number" min="0" max="100" step="0.01" /><Field label="12th percentage" value={draft.twelfthPercentage} onChange={(v) => setDraft((d) => ({ ...d, twelfthPercentage: v }))} type="number" min="0" max="100" step="0.01" /><Field label="Total backlogs" value={draft.backlogs} onChange={(v) => setDraft((d) => ({ ...d, backlogs: v }))} type="number" min="0" max="1000" /><Field label="Active backlogs" value={draft.activeBacklogs} onChange={(v) => setDraft((d) => ({ ...d, activeBacklogs: v }))} type="number" min="0" max="1000" /></div><SaveBar saving={saving} onSave={save} onCancel={cancelEdit} /></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Info label="Institution" value={academic.institutionName} /><Info label="Department" value={academic.department} /><Info label="Course" value={academic.course} /><Info label="Degree" value={academic.degree} /><Info label="Enrollment" value={academic.enrollmentNumber || academic.enrollmentNo} /><Info label="Semester" value={academic.semester} /><Info label="Batch" value={academic.batch} /><Info label="Academic email" value={academic.academicEmail} /><Info label="Admission year" value={academic.admissionYear} /><Info label="Graduation year" value={academic.graduationYear} /><Info label="CGPA" value={academic.cgpa} /><Info label="10th percentage" value={academic.tenthPercentage} /><Info label="12th percentage" value={academic.twelfthPercentage} /><Info label="Backlogs" value={academic.backlogs} /><Info label="Active backlogs" value={academic.activeBacklogs} /></div>}
          </Card>}

          {active === "skills" && <Card title="Skills" subtitle="Technical and professional skills with level and category." icon={BookOpen} action={<button onClick={() => beginEdit("skills")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Pencil className="mr-1.5 inline h-3.5 w-3.5" />Manage</button>}>
            {editing === "skills" ? <div className="space-y-3">{draft.map((skill, index) => <div key={`${index}-${skill.id || skill.name || "new"}`} className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[1.4fr_1fr_1fr_auto]"><Field label="Skill" value={skill.name} onChange={(v) => setDraft((d) => d.map((item, i) => i === index ? { ...item, name: v } : item))} placeholder="React, Java, SQL..." /><label className="space-y-1.5 block"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Level</span><select className={inputClass} value={skill.level || ""} onChange={(e) => setDraft((d) => d.map((item, i) => i === index ? { ...item, level: e.target.value } : item))}><option value="">Select level</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option><option value="Expert">Expert</option></select></label><Field label="Category" value={skill.category} onChange={(v) => setDraft((d) => d.map((item, i) => i === index ? { ...item, category: v } : item))} placeholder="Frontend, Backend..." /><button type="button" onClick={() => setDraft((d) => d.filter((_, i) => i !== index))} className="mt-6 flex h-10 items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>)}<button type="button" onClick={() => setDraft((d) => [...d, { name: "", level: "", category: "" }])} className="rounded-xl border border-dashed border-blue-300 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"><Plus className="mr-1.5 inline h-4 w-4" />Add skill</button><SaveBar saving={saving} onSave={save} onCancel={cancelEdit} /></div> : profile.skills?.length ? <div className="flex flex-wrap gap-3">{profile.skills.map((skill) => <div key={skill.id || skill.name} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><div className="font-bold text-slate-800">{skill.name}</div><div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-slate-500">{skill.level ? <span className="rounded-full bg-white px-2 py-1">{skill.level}</span> : null}{skill.category ? <span className="rounded-full bg-white px-2 py-1">{skill.category}</span> : null}</div></div>)}</div> : <div className={mutedClass}>No skills added yet. Add your strongest technical and professional skills.</div>}
          </Card>}

          {active === "certifications" && <Card title="Certifications" subtitle="Credentials, courses and industry certifications." icon={Award} action={<button onClick={() => beginEdit("certifications")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Pencil className="mr-1.5 inline h-3.5 w-3.5" />Manage</button>}>
            {editing === "certifications" ? <div className="space-y-4">{draft.map((item, index) => <div key={`${index}-${item.id || item.name || "new"}`} className="rounded-2xl border border-slate-200 p-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Certification name" value={item.name} onChange={(v) => setDraft((d) => d.map((x, i) => i === index ? { ...x, name: v } : x))} /><Field label="Issuing organization" value={item.issuingOrganization} onChange={(v) => setDraft((d) => d.map((x, i) => i === index ? { ...x, issuingOrganization: v } : x))} /><Field label="Issue date" value={item.issueDate} onChange={(v) => setDraft((d) => d.map((x, i) => i === index ? { ...x, issueDate: v } : x))} type="date" /><Field label="Expiry date" value={item.expiryDate} onChange={(v) => setDraft((d) => d.map((x, i) => i === index ? { ...x, expiryDate: v } : x))} type="date" /><Field label="Credential ID" value={item.credentialId} onChange={(v) => setDraft((d) => d.map((x, i) => i === index ? { ...x, credentialId: v } : x))} /><Field label="Credential URL" value={item.credentialUrl} onChange={(v) => setDraft((d) => d.map((x, i) => i === index ? { ...x, credentialUrl: v } : x))} /></div><button type="button" onClick={() => setDraft((d) => d.filter((_, i) => i !== index))} className="mt-3 text-xs font-semibold text-red-600 hover:underline"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Remove certification</button></div>)}<button type="button" onClick={() => setDraft((d) => [...d, { name: "", issuingOrganization: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "" }])} className="rounded-xl border border-dashed border-blue-300 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"><Plus className="mr-1.5 inline h-4 w-4" />Add certification</button><SaveBar saving={saving} onSave={save} onCancel={cancelEdit} /></div> : profile.certifications?.length ? <div className="grid gap-3 sm:grid-cols-2">{profile.certifications.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="font-bold text-slate-900">{item.name}</div><div className="mt-1 text-sm text-slate-500">{item.issuingOrganization || "Issuing organization not provided"}</div><div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500"><span className="rounded-full bg-slate-50 px-2.5 py-1">{item.issueDate || "Date not provided"}</span>{item.credentialId ? <span className="rounded-full bg-slate-50 px-2.5 py-1">{item.credentialId}</span> : null}{item.credentialUrl ? <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 hover:bg-blue-100">View credential</a> : null}</div></div>)}</div> : <div className={mutedClass}>No certifications yet. Add relevant credentials to strengthen your profile.</div>}
          </Card>}

          {active === "documents" && <Card title="Resume & documents" subtitle="Keep your placement resume and supporting documents current." icon={FileText} action={<button onClick={() => beginEdit("documents")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Pencil className="mr-1.5 inline h-3.5 w-3.5" />Manage</button>}>
            {editing === "documents" ? <div className="space-y-5"><div className="rounded-2xl border border-blue-100 bg-blue-50 p-4"><div className="text-sm font-bold text-blue-900">Resume link</div><p className="mt-1 text-xs text-blue-700">The current profile API stores resume metadata/URL. Actual file upload remains on the existing onboarding flow.</p><div className="mt-3"><Field label="Resume URL" value={draft.resumeUrl} onChange={(v) => setDraft((d) => ({ ...d, resumeUrl: v }))} placeholder="https://..." /></div></div><div className="space-y-3"><div className="text-sm font-bold text-slate-900">Documents</div>{(draft.documents || []).map((item, index) => <div key={`${index}-${item.id || item.documentName || "new"}`} className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-2"><Field label="Document type" value={item.documentType} onChange={(v) => setDraft((d) => ({ ...d, documents: d.documents.map((x, i) => i === index ? { ...x, documentType: v } : x) }))} /><Field label="Document name" value={item.documentName} onChange={(v) => setDraft((d) => ({ ...d, documents: d.documents.map((x, i) => i === index ? { ...x, documentName: v } : x) }))} /><Field label="Document URL" value={item.documentUrl} onChange={(v) => setDraft((d) => ({ ...d, documents: d.documents.map((x, i) => i === index ? { ...x, documentUrl: v } : x) }))} /><Field label="File name" value={item.fileName} onChange={(v) => setDraft((d) => ({ ...d, documents: d.documents.map((x, i) => i === index ? { ...x, fileName: v } : x) }))} /><button type="button" onClick={() => setDraft((d) => ({ ...d, documents: d.documents.filter((_, i) => i !== index) }))} className="text-xs font-semibold text-red-600 hover:underline sm:col-span-2"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Remove document</button></div>)}<button type="button" onClick={() => setDraft((d) => ({ ...d, documents: [...(d.documents || []), { documentType: "", documentName: "", documentUrl: "", fileName: "" }] }))} className="rounded-xl border border-dashed border-blue-300 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"><Plus className="mr-1.5 inline h-4 w-4" />Add document</button></div><SaveBar saving={saving} onSave={save} onCancel={cancelEdit} /></div> : <div className="space-y-4">{profile.resume ? <div className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600"><FileText className="h-5 w-5" /></div><div><div className="font-bold text-emerald-900">{profile.resume.fileName || "Resume"}</div><div className="text-xs text-emerald-700">{formatBytes(profile.resume.fileSize)} {profile.resume.mimeType ? `• ${profile.resume.mimeType}` : ""}</div></div></div>{profile.resume.url ? <a href={profile.resume.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"><ExternalLink className="h-3.5 w-3.5" />Open resume</a> : null}</div> : <div className={mutedClass}>No resume linked. Use the onboarding resume upload or add a URL here.</div>}{profile.documents?.length ? <div className="grid gap-3 sm:grid-cols-2">{profile.documents.map((doc) => <a key={doc.id} href={doc.documentUrl || "#"} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"><div className="flex items-start justify-between gap-3"><div><div className="font-bold text-slate-800">{doc.documentName || doc.fileName || "Document"}</div><div className="mt-1 text-xs text-slate-500">{doc.documentType || "Supporting document"}</div></div><ExternalLink className="h-4 w-4 text-slate-400" /></div></a>)}</div> : null}</div>}
          </Card>}

          {active === "social" && <Card title="Social profiles" subtitle="Connect professional profiles recruiters and mentors can review." icon={LinkIcon} action={<button onClick={() => beginEdit("social")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Pencil className="mr-1.5 inline h-3.5 w-3.5" />Edit</button>}>
            {editing === "social" ? <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="LinkedIn" value={draft.linkedin} onChange={(v) => setDraft((d) => ({ ...d, linkedin: v }))} placeholder="https://linkedin.com/in/..." /><Field label="GitHub" value={draft.github} onChange={(v) => setDraft((d) => ({ ...d, github: v }))} placeholder="https://github.com/..." /><Field label="Portfolio" value={draft.portfolio} onChange={(v) => setDraft((d) => ({ ...d, portfolio: v }))} placeholder="https://..." /><Field label="Twitter / X" value={draft.twitter} onChange={(v) => setDraft((d) => ({ ...d, twitter: v }))} placeholder="https://x.com/..." /><Field label="Website" value={draft.website} onChange={(v) => setDraft((d) => ({ ...d, website: v }))} placeholder="https://..." /></div><SaveBar saving={saving} onSave={save} onCancel={cancelEdit} /></div> : <div className="grid gap-3 sm:grid-cols-2">{[["LinkedIn", social.linkedin, Linkedin], ["GitHub", social.github, Github], ["Portfolio", social.portfolio, Globe], ["Twitter / X", social.twitter, Globe], ["Website", social.website, Globe]].map(([label, url, Icon]) => url ? <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon className="h-4 w-4" /></div><div className="min-w-0"><div className="text-sm font-bold text-slate-800">{label}</div><div className="truncate text-xs text-blue-600">{url}</div></div><ExternalLink className="ml-auto h-4 w-4 text-slate-400" /></a> : null)}{!Object.values(social).some(Boolean) ? <div className={mutedClass}>No social profiles linked yet. Add LinkedIn, GitHub or your portfolio to improve discoverability.</div> : null}</div>}
          </Card>}

          <Card title="Student account summary" subtitle="Read-only identifiers from your account." icon={User}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><Info label="Student ID" value={profile.studentId} /><Info label="College ID" value={profile.collegeId} /><Info label="User ID" value={profile.userId} /><Info label="Resume status" value={profile.placement?.resumeStatus} /></div></Card>
        </main>
      </div>
    </div>
  </div>;
}
