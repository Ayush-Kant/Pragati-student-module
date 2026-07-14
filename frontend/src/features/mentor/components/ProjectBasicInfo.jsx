import React from "react";
import { Info, Clock } from "lucide-react";

export default function ProjectBasicInfo({ register, errors, watch, setValue }) {
  const isVisible = watch("visibility");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Basic Information</h3>
          <p className="text-xs text-gray-500">Provide the primary details and display settings of the project.</p>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title")}
          placeholder="e.g., Full Stack E-Commerce Dashboard"
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.title ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-100"
          } focus:border-blue-500 outline-none transition-all text-sm`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.title.message}</p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
        <textarea
          {...register("description")}
          placeholder="Briefly describe the project's goal..."
          rows={3}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.description ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-100"
          } focus:border-blue-500 outline-none transition-all text-sm resize-none`}
        />
        <div className="flex justify-between mt-1 text-[11px] text-gray-400">
          <span>Max 300 characters recommended</span>
          {errors.description && (
            <span className="text-red-500 font-medium">{errors.description.message}</span>
          )}
        </div>
      </div>

      {/* Row: Difficulty and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Difficulty Level <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("difficulty")}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.difficulty ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-100"
              } focus:border-blue-500 outline-none transition-all text-sm bg-white appearance-none`}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-xs">
              ▼
            </span>
          </div>
          {errors.difficulty && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.difficulty.message}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estimated Duration <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Clock className="w-4 h-4" />
            </span>
            <input
              type="text"
              {...register("duration")}
              placeholder="e.g., 2 Weeks"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.duration ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-100"
              } focus:border-blue-500 outline-none transition-all text-sm`}
            />
          </div>
          {errors.duration && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.duration.message}</p>
          )}
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Public Visibility</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Allow non-enrolled students to view this project in the catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setValue("visibility", !isVisible)}
          className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-200 ${
            isVisible ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"
          }`}
        >
          <span className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform" />
        </button>
      </div>
    </div>
  );
}
