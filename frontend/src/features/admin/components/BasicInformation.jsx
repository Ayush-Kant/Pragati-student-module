import React from "react";
import AdminAvatarUpload from "./AdminAvatarUpload";

const BasicInformation = ({ register, errors, setValue, avatarUrl, fullName }) => {
  return (
    <div className="w-full">
      {/* Gradient Top Bar Decorator */}
      <div className="w-12 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full mb-5" />

      {/* Heading */}
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Basic Information</h2>
      <p className="text-sm text-slate-500 mt-1.5 mb-6 leading-relaxed">
        Help us build your professional profile.
        <br />
        These details will be visible to potential mentees.
      </p>

      {/* Profile Photo Uploader Slot */}
      <div className="mb-6">
        <AdminAvatarUpload
          avatarUrl={avatarUrl}
          fullName={fullName}
          setValue={setValue}
        />
      </div>

      {/* Grid Inputs: Full Name & Display Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="e.g. Alex Rivera"
            {...register("fullName")}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white transition-all shadow-sm"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Display Title
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Software Arch"
            {...register("displayTitle")}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white transition-all shadow-sm"
          />
          {errors.displayTitle && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.displayTitle.message}</p>
          )}
        </div>
      </div>

      {/* Input: Email Address with Envelope Icon */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Email Address
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-slate-400 text-base">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </span>
          <input
            type="email"
            placeholder="alex@company.com"
            {...register("email")}
            className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white transition-all shadow-sm"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Textarea: Professional Bio */}
      <div className="mb-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Professional Bio
        </label>
        <textarea
          rows={4}
          placeholder="Briefly describe your mentorship style and professional background..."
          {...register("bio")}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white transition-all shadow-sm resize-y"
        />
        {errors.bio && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.bio.message}</p>
        )}
      </div>
    </div>
  );
};

export default BasicInformation;
