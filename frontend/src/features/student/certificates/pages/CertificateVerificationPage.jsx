import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import CertificateVerification from "../components/verification/CertificateVerification";

const CertificateVerificationPage = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-9 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* Back navigation */}
        <div className="mb-5 sm:mb-6">
          <Link
            to="/student/certificates"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:text-sm"
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
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:p-5 md:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-12 sm:w-12">
              <ShieldCheck
                className="h-5 w-5 sm:h-6 sm:w-6"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:text-[11px]">
                Certificate Verification
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                Verify Certificate Authenticity
              </h1>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
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