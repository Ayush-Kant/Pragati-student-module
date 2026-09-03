import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerStudentApi, loginStudentApi } from "./services/studentAuth.services";
import { signInStudentWithPassword, getFirebaseIdToken } from "../../firebase/studentFirebaseAuth";
import { useAuth } from "../../context/AuthContext";

const initialForm = { fullName: "", email: "", password: "", confirmPassword: "", collegeId: "" };

export default function StudentRegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.fullName.trim().length < 2 || form.fullName.trim().length > 80) return setError("Enter your full name (2-80 characters).");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Enter a valid email address.");
    if (!/^\d+$/.test(form.collegeId.trim())) return setError("Enter the numeric College ID provided by your college.");
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password)) {
      return setError("Password must be at least 8 characters with an uppercase letter, digit, and special character.");
    }
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    setSaving(true);
    try {
      const registered = await registerStudentApi({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        fullName: form.fullName.trim(),
        collegeId: Number(form.collegeId),
      });

      if (!registered?.success) throw new Error(registered?.message || "Registration failed");

      // Registration creates the Firebase account server-side. Sign in with the same
      // credentials, exchange the Firebase ID token for the platform JWT, then begin onboarding.
      await signInStudentWithPassword(form.email.trim().toLowerCase(), form.password);
      const idToken = await getFirebaseIdToken();
      const session = await loginStudentApi(idToken);
      login("student", session.accessToken);
      toast.success("Registration successful. Complete your student profile.");
      navigate("/student/onboarding", { replace: true });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Registration failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-600">Pragati Student</p>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Create your student account</h1>
          <p className="text-sm text-slate-500 mt-2">Your account is secured by Firebase and the Pragati student session layer.</p>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Full name" value={form.fullName} onChange={(v) => set("fullName", v)} placeholder="Arjun Sharma" />
          <Field label="College ID" value={form.collegeId} onChange={(v) => set("collegeId", v)} placeholder="e.g. 12" inputMode="numeric" />
          <Field label="College email" value={form.email} onChange={(v) => set("email", v)} placeholder="student@college.edu" type="email" />
          <Field label="Password" value={form.password} onChange={(v) => set("password", v)} placeholder="At least 8 characters" type="password" />
          <Field label="Confirm password" value={form.confirmPassword} onChange={(v) => set("confirmPassword", v)} placeholder="Repeat password" type="password" />

          <button disabled={saving} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 disabled:opacity-60">
            {saving ? "Creating account…" : "Create student account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already registered? <button className="font-bold text-blue-600 hover:underline" onClick={() => navigate("/student/login")}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", inputMode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} inputMode={inputMode} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
    </label>
  );
}
