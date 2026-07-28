import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Megaphone,
  AlertCircle,
  Calendar,
  Users,
  Tag,
  Flag,
  Globe,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { validateAnnouncement } from "../../validations/communicationValidation";

const AUDIENCE_OPTIONS = [
  "All Students",
  "Final Year Students",
  "3rd Year Students",
  "2nd Year Students",
  "1st Year Students",
  "CSE Department",
  "ECE Department",
  "ME Department",
];

const CATEGORY_OPTIONS = [
  { id: 1, name: "Placement" },
  { id: 2, name: "Training" },
  { id: 3, name: "General" },
  { id: 4, name: "Hackathon" },
];

const AnnouncementForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const outletContext = useOutletContext() || {};
  const darkMode = outletContext.darkMode || false;

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || initialData?.content || "",
    category_id: initialData?.categoryId || initialData?.category_id || 4,
    priority: initialData?.priority || "Medium",
    target_audience: initialData?.targetAudience || initialData?.target_audience || "All Students",
    expiry_date: initialData?.expiryDate
      ? new Date(initialData.expiryDate).toISOString().split("T")[0]
      : "",
    visibility: initialData?.visibility || "Public",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

// Retrieve user from localStorage or auth context if available
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const createdById = currentUser.id ? parseInt(currentUser.id, 10) : 1; 

const handleSubmit = async (e) => {
  e.preventDefault();

  const validation = validateAnnouncement(formData);
  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }

  try {
    setIsSubmitting(true);
    
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category_id: Number(formData.category_id),
      priority: formData.priority,
      target_audience: formData.target_audience,
      expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
      visibility: formData.visibility,
      created_by: createdById // <--- Send integer ID here
    };

    await onSubmit(payload);
  } catch (err) {
    setErrors({ server: err.message || "Failed to save announcement" });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Megaphone className="text-blue-500" size={22} />
              {isEditing ? "Edit Announcement" : "Create New Announcement"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fill in the details to publish or draft a notice for students.
            </p>
          </div>
        </div>
      </div>

      {errors.server && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          {errors.server}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`p-6 rounded-2xl border space-y-6 ${
            darkMode
              ? "bg-[#151D30] border-slate-800"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Announcement Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Google Placement Drive 2026"
              className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : darkMode
                  ? "bg-slate-900/60 border-slate-700 text-slate-100"
                  : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.title}
              </p>
            )}
          </div>

          {/* Grid Options: Priority, Category, Target Audience, Event/Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Flag size={14} className="text-amber-500" /> Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-700 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Users size={14} className="text-blue-500" /> Target Audience
              </label>
              <select
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-700 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                {AUDIENCE_OPTIONS.map((aud) => (
                  <option key={aud} value={aud}>
                    {aud}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Tag size={14} className="text-purple-500" /> Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-700 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Event / Expiry Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-500" /> Target / Deadline Date
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-700 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Announcement Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed instructions, registration links, eligibility criteria, or guidelines..."
              className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : darkMode
                  ? "bg-slate-900/60 border-slate-700 text-slate-100"
                  : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Announcement"
              : "Save Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;