import React, { useState } from "react";
import { Link } from "react-router-dom";

const mockCertificates = [
  {
    id: "cert-01",
    title: "MERN Stack Full Development",
    issuedBy: "Pragati - TechCorp Drive",
    issueDate: "2026-06-15",
    credentialId: "PRG-2026-MERN-8492",
    grade: "Distinction",
    skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"]
  },
  {
    id: "cert-02",
    title: "Frontend Engineering & React Mastery",
    issuedBy: "Pragati Upskilling Program",
    issueDate: "2026-05-10",
    credentialId: "PRG-2026-FE-1048",
    grade: "Excellent",
    skills: ["React.js", "Redux Toolkit", "REST APIs", "JavaScript ES6+"]
  },
  {
    id: "cert-03",
    title: "Data Structures & Algorithms in Java",
    issuedBy: "Uptoskills Engineering",
    issueDate: "2026-03-20",
    credentialId: "PRG-2026-DSA-5519",
    grade: "A+",
    skills: ["Java", "Algorithms", "Problem Solving", "System Design"]
  }
];

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, credId) => {
    navigator.clipboard.writeText(credId);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link to="/student/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Certificates</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Earned Certificates</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, download, and share your verified credentials and achievement awards.
          </p>
        </div>

        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 shadow-sm transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total Issued
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">3</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Verified Credentials
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">100%</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Latest Achievement
          </p>
          <p className="text-sm font-bold text-gray-800 mt-2 truncate">
            MERN Stack Full Development
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockCertificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
                    Verified Award
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">{cert.title}</h3>
                  <p className="text-sm text-gray-600 font-medium mt-0.5">{cert.issuedBy}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-xl shrink-0">
                  📜
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium">Issue Date: </span>
                  <span className="text-gray-700 font-semibold">{cert.issueDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Grade / Rating: </span>
                  <span className="text-emerald-700 font-semibold">{cert.grade}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400 mb-1.5">Validated Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
                <span className="truncate">ID: {cert.credentialId}</span>
                <button
                  onClick={() => handleCopy(cert.id, cert.credentialId)}
                  className="text-blue-600 hover:text-blue-800 font-semibold ml-2 shrink-0"
                >
                  {copiedId === cert.id ? "Copied!" : "Copy ID"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedCert(cert)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition text-center shadow-sm"
              >
                View & Share
              </button>
              <button
                onClick={() => alert(`Downloading certificate: ${cert.credentialId}`)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">Certificate Preview</h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl text-center space-y-3">
              <span className="text-3xl">🎓</span>
              <h4 className="text-base font-bold text-gray-900">{selectedCert.title}</h4>
              <p className="text-xs text-gray-600">Issued by {selectedCert.issuedBy}</p>
              <p className="text-[11px] font-mono text-gray-500 pt-2 border-t border-blue-100">
                Credential: {selectedCert.credentialId}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Share verification link</p>
              <input
                type="text"
                readOnly
                value={`https://pragati.uptoskills.com/verify/${selectedCert.credentialId}`}
                className="w-full text-xs font-mono bg-gray-50 border rounded-lg p-2.5 text-gray-600 outline-none select-all"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://pragati.uptoskills.com/verify/${selectedCert.credentialId}`
                  );
                  alert("Verification link copied to clipboard!");
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}