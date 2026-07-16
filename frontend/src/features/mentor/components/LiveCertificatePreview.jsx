import React from "react";



const LiveCertificatePreview = ({ data }) => {
  const {
    brandColors = {
      primary: "#2563eb",
      secondary: "#1e293b",
    },

    organizationName = "UPTOSKILLS",

    logo = null,

    previewPlaceholders = {
      studentName: "Student Name",
      programName: "Full Stack Web Development",
      score: "95%",
      mentorName: "Mentor Name",
    },

    skillTags = [],

    signature = {},
  } = data || {};

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-white shadow-2xl"
    style={{
    width: "700px",
    minHeight: "500px",
}}
    >
      {/* Decorative Borders */}

      <div
        className="absolute left-0 top-0 h-full w-4"
        style={{
          backgroundColor: brandColors.primary,
        }}
      />

      <div
        className="absolute left-0 top-0 h-4 w-full"
        style={{
          backgroundColor: brandColors.primary,
        }}
      />

      <div
        className="absolute bottom-8 right-8 h-40 w-40 rounded-full opacity-10"
        style={{
          backgroundColor: brandColors.primary,
        }}
      />

      {/* Certificate */}

      <div className="flex h-full flex-col justify-between px-16 py-12 text-center">

        {/* Header */}

        <div className="mt-6 flex flex-col items-center">

         {logo?.preview || logo?.url ? (
  <img
    src={logo.preview || logo.url}
    alt="Logo"
    className="mb-4 h-20 object-contain"
  />
) : (
  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
    Logo
  </div>
)}

          <h2
            className="text-2xl font-bold uppercase tracking-[6px]"
            style={{
              color: brandColors.secondary,
            }}
          >
            {organizationName}
          </h2>
        </div>

        {/* Body */}

        <div className="py-8">

          <h1
            className="mb-4 text-6xl font-serif font-bold"
            style={{
              color: brandColors.secondary,
            }}
          >
            CERTIFICATE
          </h1>

          <h2
            className="mb-8 text-3xl font-light"
            style={{
              color: brandColors.secondary,
            }}
          >
            OF COMPLETION
          </h2>

          <p className="mb-5 text-lg italic text-gray-500">
            This is to certify that
          </p>

          <h2
            className="mb-6 text-5xl font-bold"
            style={{
              color: brandColors.primary,
            }}
          >
            {previewPlaceholders.studentName}
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600">
            has successfully completed the
            <strong> {previewPlaceholders.programName}</strong>
            {" "}training program with an overall score of
            <strong> {previewPlaceholders.score}</strong>.
          </p>
        </div>

        {/* Footer */}

        <div className="mt-10 flex items-end justify-between">

          {/* Skills */}

          <div className="w-1/3 text-left">

            <p className="mb-3 text-xs font-semibold uppercase text-gray-500">
              Skills
            </p>

            <div className="flex flex-wrap gap-2">

              {skillTags.length > 0 ? (
                skillTags.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                    React
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                    Node.js
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                    Express
                  </span>
                </>
              )}

            </div>

          </div>

          {/* Signature */}

          <div className="w-1/3 text-center">

          {signature?.url || signature?.preview ? (
  <img
    src={signature.preview || signature.url}
    alt="Signature"
    className="mx-auto mb-2 h-16 object-contain"
  />
) : (
              <div className="mx-auto mb-2 flex h-16 w-40 items-center justify-center rounded border-2 border-dashed border-gray-300 text-xs text-gray-400">
                Signature
              </div>
            )}

            <div className="mx-auto mb-2 w-40 border-t border-gray-400"></div>

            <h4 className="font-semibold">
              {previewPlaceholders.mentorName}
            </h4>

            <p className="text-xs text-gray-500">
              Program Mentor
            </p>

          </div>

          {/* QR Code */}

          <div className="w-1/3 flex justify-end">

            <div className="flex h-24 w-24 items-center justify-center rounded border-2 border-dashed border-gray-300 text-xs text-gray-400">
              QR Code
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LiveCertificatePreview;