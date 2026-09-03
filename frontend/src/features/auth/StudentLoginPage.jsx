import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  loginStudentApi,
  refreshStudentApi,
} from "./services/studentAuth.services";
import {
  getFirebaseIdToken,
  signInStudentWithGoogle,
  signInStudentWithPassword,
} from "../../firebase/studentFirebaseAuth";
import { useAuth } from "../../context/AuthContext";

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const exchangeFirebaseSession = async () => {
    const idToken = await getFirebaseIdToken();
    const session = await loginStudentApi(idToken);
    login("student", session.accessToken);
    return session;
  };

  const finish = (session) => {
    const next = session?.student?.onboardingStep;
    if (next && next < 4) {
      navigate("/student/onboarding", { replace: true });
    } else {
      navigate("/student/dashboard", { replace: true });
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Email and password are required.");
    setLoading(true);

    try {
      await signInStudentWithPassword(email.trim().toLowerCase(), password);
      const session = await exchangeFirebaseSession();
      toast.success("Welcome back");
      finish(session);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInStudentWithGoogle();
      const session = await exchangeFirebaseSession();
      toast.success("Signed in with Google");
      finish(session);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const useExistingSession = async () => {
    setError("");
    setLoading(true);
    try {
      const session = await refreshStudentApi();
      login("student", session.accessToken);
      finish(session);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "No active student session found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8">
        <p className="text-xs font-bold tracking-widest uppercase text-blue-600">Pragati Student</p>
        <h1 className="text-3xl font-black text-slate-900 mt-2">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-2 mb-6">Sign in with Firebase to access your student account.</p>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="student@college.edu" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="Password" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
        </form>

        <button disabled={loading} onClick={googleLogin} className="w-full mt-3 rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Continue with Google</button>
        <button disabled={loading} onClick={useExistingSession} className="w-full mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600">Restore existing student session</button>

        <p className="mt-6 text-center text-sm text-slate-500">New student? <button className="font-bold text-blue-600 hover:underline" onClick={() => navigate("/student/register")}>Create an account</button></p>
      </div>
    </div>
  );
}
