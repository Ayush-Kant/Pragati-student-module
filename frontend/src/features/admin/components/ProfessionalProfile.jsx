import React from "react";

const ProfessionalProfile = ({ register, errors, watch, setValue }) => {
  const bio2 = watch("bio2") || "";
  const certifications = watch("certifications") || [];

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newCert = {
      name: file.name.split(".")[0],
      fileName: file.name,
    };
    setValue("certifications", [...certifications, newCert], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeCert = (index) => {
    const updated = certifications.filter((_, i) => i !== index);
    setValue("certifications", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="w-full">
      {/* Header Info */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-violet-600 tracking-widest uppercase mb-1.5 block">
          STEP 02
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Complete your professional profile
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
          Your profile is the first thing mentees see. Let's make it stand out with your achievements and expertise.
        </p>
      </div>

      {/* Card 1: Professional Bio with Purple Left Border */}
      <div className="border border-slate-200 border-l-4 border-l-violet-600 rounded-2xl p-5 mb-5 bg-white shadow-sm">
        <label className="block text-sm font-bold text-slate-900 mb-3">
          Professional Bio
        </label>
        <textarea
          rows={5}
          maxLength={500}
          placeholder="Share your professional journey, key achievements, and what motivates you to mentor others..."
          {...register("bio2")}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 bg-white transition-all resize-y"
        />
        <div className="flex justify-between items-center mt-2.5">
          {errors.bio2 ? (
            <p className="text-red-500 text-xs font-medium">{errors.bio2.message}</p>
          ) : (
            <div />
          )}
          <span className="text-xs text-slate-400 font-medium">
            {bio2.length} / 500 characters
          </span>
        </div>
      </div>

      {/* Grid: LinkedIn & GitHub Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* LinkedIn with Green Left Border */}
        <div className="border border-slate-200 border-l-4 border-l-emerald-500 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-500 text-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </span>
              <label className="text-sm font-bold text-slate-900">LinkedIn URL</label>
            </div>
            <input
              type="text"
              placeholder="https://linkedin.com/in/username"
              {...register("linkedin")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all"
            />
          </div>
          {errors.linkedin && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.linkedin.message}</p>
          )}
        </div>

        {/* GitHub with Orange Left Border */}
        <div className="border border-slate-200 border-l-4 border-l-orange-500 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-500 text-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </span>
              <label className="text-sm font-bold text-slate-900">GitHub / Portfolio</label>
            </div>
            <input
              type="text"
              placeholder="https://github.com/username"
              {...register("github")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all"
            />
          </div>
          {errors.github && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.github.message}</p>
          )}
        </div>
      </div>

      {/* Card 3: Industry Certifications with Purple Left Border */}
      <div className="border border-slate-200 border-l-4 border-l-violet-600 rounded-2xl p-5 bg-white shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Industry Certifications</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload relevant AWS, PMP, or professional credentials.
            </p>
          </div>
          <label className="bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100 transition px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer">
            + Add New
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Drag & drop upload box */}
        <label className="border-2 border-dashed border-violet-200 hover:border-violet-400 rounded-xl p-6 text-center bg-violet-50/20 hover:bg-violet-50/40 transition duration-200 flex flex-col items-center justify-center cursor-pointer mb-4">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mb-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-900">Click or drag to upload files</p>
          <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG (Max 5MB)</p>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Display Uploaded files list */}
        {certifications.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-slate-700">Uploaded Certifications:</p>
            <div className="grid grid-cols-1 gap-2">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 text-xs text-slate-800 font-medium"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-violet-600 text-lg">📄</span>
                    <span className="truncate max-w-[200px]">{cert.name}</span>
                    <span className="text-slate-400 text-[10px] truncate max-w-[120px] font-normal">
                      ({cert.fileName})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCert(index)}
                    className="text-red-500 hover:text-red-700 font-bold p-1 transition"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalProfile;
