import React from "react";

const LiveCertificatePreview = ({ data }) => {
  const {
    brandColors = { primary: "#2563eb", secondary: "#1e293b" },
    organizationName = "UPTOSKILLS",
    logo = null,
    signature = null,
    skillTags = [],
    previewPlaceholders = {
      studentName: "[Student Name]",
      programName: "Full Stack Web Development",
      score: "95%",
      mentorName: "[Mentor Name]",
    },
  } = data || {};

  return (
    <div
      className="relative flex flex-col items-center justify-between bg-white shadow-2xl"
      style={{ width: "800px", height: "560px" }}
    >
      {/* Top Left Border */}
      <div
        className="absolute top-10 left-10 h-32 w-4"
        style={{ backgroundColor: brandColors.primary }}
      />
      <div
        className="absolute top-10 left-10 h-4 w-32"
        style={{ backgroundColor: brandColors.primary }}
      />

      {/* Bottom Right Border */}
      <div
        className="absolute bottom-10 right-10 h-32 w-4"
        style={{ backgroundColor: brandColors.primary }}
      />
      <div
        className="absolute bottom-10 right-10 h-4 w-32"
        style={{ backgroundColor: brandColors.primary }}
      />

      {/* Top Content (Logo & Headers) */}
      <div className="z-10 flex w-full flex-col items-center justify-center pt-14 text-center">
        {/* Logo */}
        <div className="mb-4">
          {logo?.preview || logo?.url ? (
            <img
              src={logo.preview || logo.url}
              alt="Logo"
              className="h-16 w-16 object-contain"
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl"
              style={{ backgroundColor: brandColors.primary }}
            >
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Organization Name */}
        <h2 className="mb-2 text-lg font-bold tracking-[0.2em] text-gray-900">
          {organizationName}
        </h2>

        {/* Title */}
        <h1 className="mb-6 font-serif text-[3.5rem] font-bold leading-tight text-gray-900">
          CERTIFICATE OF <br /> COMPLETION
        </h1>

        {/* Subtitle */}
        <p className="mb-6 font-serif text-xl italic text-gray-700">
          This is to certify that
        </p>

        {/* Student Name */}
        <h2
          className="text-5xl font-bold"
          style={{ color: brandColors.primary }}
        >
          {previewPlaceholders.studentName}
        </h2>
      </div>

      {/* Footer Content (Skills, Signature, QR Code) */}
      <div className="z-10 flex w-full items-end justify-between px-20 pb-12">
        {/* Skills */}
        <div className="w-1/3 text-left">
          {skillTags && skillTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skillTags.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Signature */}
        <div className="flex w-1/3 flex-col items-center justify-center text-center">
          {signature?.preview || signature?.url ? (
            <img
              src={signature.preview || signature.url}
              alt="Mentor Signature"
              className="mb-2 h-12 object-contain"
            />
          ) : (
            <div className="mb-2 h-12 w-32 rounded border border-dashed border-gray-300 bg-gray-50/50" />
          )}
          <div className="mb-1 h-px w-40 bg-gray-400"></div>
          <p className="text-sm font-bold text-gray-800">
            {previewPlaceholders.mentorName}
          </p>
          <p className="text-xs text-gray-500">Program Mentor</p>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex w-1/3 justify-end">
          <div className="flex h-16 w-16 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 p-1">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCertificatePreview;