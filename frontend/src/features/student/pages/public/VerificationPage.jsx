// VerificationPage.jsx
// Purpose: Public certificate verification page rendered when a QR code or verification URL is scanned (SM-13)

import ThemeToggle from "../../../../components/common/ThemeToggle";

const VerificationPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] p-6 text-gray-800 dark:text-white relative transition-colors duration-300">
      <ThemeToggle variant="floating" />
      <div className="max-w-2xl mx-auto mt-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificate Verification</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">
          Public certificate verification page rendered when a QR code or verification URL is scanned (SM-13).
        </p>
      </div>
    </div>
  );
};

export default VerificationPage;
