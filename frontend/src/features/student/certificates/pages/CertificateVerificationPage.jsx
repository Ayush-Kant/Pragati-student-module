import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import CertificateVerification from "../components/verification/CertificateVerification";

const CertificateVerificationPage = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0b0f19] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-9 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* Back navigation */}
        <div className="mb-5 sm:mb-6">
          <Link
            to="/student/certificates"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors duration-200 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 sm:text-sm"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              Back to Certificates
            </span>
          </Link>
        </div>

        {/* Page header */}
        <section className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-lg sm:mb-6 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-4 ring-white/10 sm:h-14 sm:w-14">
              <ShieldCheck
                className="h-6 w-6 sm:h-7 sm:w-7 text-white"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                Certificate Verification
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Verify Certificate Authenticity
              </h1>

              <p className="mt-1 text-sm text-blue-100 max-w-2xl">
                Enter a certificate ID to confirm whether a certificate is valid and authentic.
              </p>
            </div>
          </div>
        </section>

        {/* Verification experience */}
        <CertificateVerification />
      </div>
    </main>
  );
};

export default CertificateVerificationPage;