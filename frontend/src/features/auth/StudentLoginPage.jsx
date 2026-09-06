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
import ThemeToggle from "../../components/common/ThemeToggle";

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
    if (!session?.success || !session?.accessToken) {
      throw new Error(session?.message || "Unable to create your student session");
    }
    return session;
  };

  const finish = (session) => {
    const next = Number(session?.student?.onboardingStep || 1);
    if (next < 4) navigate("/student/onboarding", { replace: true });
    else navigate("/student/dashboard", { replace: true });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Email and password are required.");
    setLoading(true);

    try {
      await signInStudentWithPassword(email.trim().toLowerCase(), password);
      const session = await exchangeFirebaseSession();
      login("student", session.accessToken);
      toast.success("Welcome back");
      finish(session);
    } catch (requestError) {
      const code = String(requestError?.code || "");
      const message = code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
        ? "Invalid email or password."
        : requestError?.response?.data?.message || requestError?.message || "Unable to sign in";
      setError(message);
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
      login("student", session.accessToken);
      toast.success("Signed in with Google");
      finish(session);
    } catch (requestError) {
      const code = String(requestError?.code || "");
      const message = code === "auth/popup-closed-by-user"
        ? "Google sign-in was cancelled."
        : requestError?.response?.data?.message || requestError?.message || "Google sign-in failed";
      setError(message);
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center p-4 relative transition-colors duration-300">
      <ThemeToggle variant="floating" />
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 transition-colors duration-300">
        <p className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">Pragati Student</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">Sign in with your Firebase student account.</p>

        {error && <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="student@college.edu"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-colors"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-colors"
          />
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 disabled:opacity-60 transition-colors">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <button disabled={loading} onClick={googleLogin} className="w-full mt-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 transition-colors">Continue with Google</button>
        <button disabled={loading} onClick={useExistingSession} className="w-full mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Restore existing student session</button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">New student? <button className="font-bold text-blue-600 dark:text-blue-400 hover:underline" onClick={() => navigate("/student/register")}>Create an account</button></p>
      </div>
    </div>
  );
}
