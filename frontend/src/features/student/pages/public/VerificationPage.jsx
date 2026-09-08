import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { verifyCertificate } from "../../certificates/services/certificateService";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};

const VerificationPage = () => {
  const { code } = useParams();
  const [state, setState] = useState({ loading: true, result: null, error: null });

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!code) {
        setState({ loading: false, result: null, error: "Verification code is missing." });
        return;
      }
      setState({ loading: true, result: null, error: null });
      try {
        const result = await verifyCertificate(code);
        if (active) setState({ loading: false, result, error: null });
      } catch (error) {
        const status = error?.response?.status;
        const message = status === 410
          ? "This certificate has been revoked by Pragati Platform."
          : status === 404
            ? "No certificate was found for this verification code."
            : error?.message || "Unable to verify this certificate right now.";
        if (active) setState({ loading: false, result: error?.response?.data || null, error: message });
      }
    };
    run();
    return () => { active = false; };
  }, [code]);

  const isValid = state.result?.valid === true || state.result?.verified === true;
  const displayCode = useMemo(() => state.result?.verificationCode || code || "—", [state.result, code]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6">
          <Link
            to="/student/certificates"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Pragati
          </Link>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-900 px-5 py-7 text-white sm:px-8 sm:py-9">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
                  Pragati Certificate Verification
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Certificate authenticity
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  This public page verifies a Pragati completion certificate using its unique verification code.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {state.loading ? (
              <div className="py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />
                <p className="mt-4 text-sm font-semibold text-slate-700">Verifying certificate…</p>
                <p className="mt-1 text-xs text-slate-500">Checking the certificate record and verification status.</p>
              </div>
            ) : state.error ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertCircle className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">Certificate could not be verified</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{state.error}</p>
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left sm:mx-auto sm:max-w-md">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verification code</p>
                  <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">{displayCode}</p>
                </div>
              </div>
            ) : (
              <div>
                <div className={`rounded-2xl border p-5 sm:p-6 ${isValid ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isValid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {isValid ? <CheckCircle2 className="h-6 w-6" aria-hidden="true" /> : <AlertCircle className="h-6 w-6" aria-hidden="true" />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isValid ? "text-emerald-800" : "text-red-800"}`}>
                        {isValid ? "Verified certificate" : "Certificate is not valid"}
                      </p>
                      <p className={`mt-1 text-xs leading-5 sm:text-sm ${isValid ? "text-emerald-700" : "text-red-700"}`}>
                        {isValid
                          ? "The verification code matches a certificate issued by Pragati Platform."
                          : "The certificate record is not valid for external verification."}
                      </p>
                    </div>
                  </div>
                </div>

                {isValid ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Certificate holder", state.result.studentName],
                      ["College", state.result.collegeName],
                      ["Recruitment drive", state.result.driveName],
                      ["Company", state.result.companyName],
                      ["Skill domain", state.result.skillDomain],
                      ["Issued by", state.result.issuedBy],
                      ["Issued at", formatDate(state.result.issuedAt)],
                      ["Verification code", displayCode],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                        <p className="mt-1.5 break-words text-sm font-semibold text-slate-900">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <p className="mt-6 text-xs leading-5 text-slate-500">
                  Verification is public and does not expose private student account information.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default VerificationPage;
