import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminAvatarUpload from "./AdminAvatarUpload";
import { useEffect } from "react";

const isValidTimeZone = (value) => {
  if (!value) return true;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
};

const profileSchema = z.object({
  fullName: z
    .string()
    .nonempty("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email"),
  bio: z
    .string()
    .max(300, "Max 300 characters")
    .optional(),
  avatarUrl: z.string().optional(),
  phone: z
  .string()
  .trim()
  .transform((val) => val.replace(/\s|-/g, ""))
  .refine((val) => /^\+?[1-9]\d{9,14}$/.test(val), {
    message: "Invalid phone number",
  })
  .optional(),
  timezone: z
    .string()
    .optional()
    .refine(isValidTimeZone, {
      message: "Invalid IANA timezone string",
    }),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

const AdminEditForm = ({
  profile,
  onSave,
  onCancel,
}) => {

const {
  register,
  handleSubmit,
  formState: { errors },
  setValue,
  watch,
  reset,
} = useForm({
  resolver: zodResolver(profileSchema),
  defaultValues: {
    fullName: "",
    email: "",
    bio: "",
    phone: "",
    timezone: "",
    avatarUrl: "",
    github: "",
    linkedin: "",
  },
});

useEffect(() => {
  if (profile) {
    reset({
      fullName: profile.fullName || "",
      email: profile.email || "",
      bio: profile.bio || "",
      phone: profile.contactInfo?.phone || "",
      timezone: profile.contactInfo?.timezone || "",
      avatarUrl: profile.avatarUrl || "",
      github: profile.socialLinks?.github || "",
      linkedin: profile.socialLinks?.linkedin || "",
    });
  }
}, [profile, reset]);

  const avatarUrl = watch("avatarUrl");
  const onSubmit = (data) => {
    const finalData = {
      ...profile,
      fullName: data.fullName,
      email: data.email,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      contactInfo: {
        phone: data.phone,
        timezone: data.timezone,
      },
      socialLinks: {
        github: data.github,
        linkedin: data.linkedin,
      },
    };
    onSave(finalData);
  };

  return (
    <div className="h-full bg-slate-100 flex items-center justify-center px-2 py-2 overflow-y-auto">
      <div className="h-full w-full max-h-[calc(100vh-1rem)] bg-white rounded-2xl shadow-lg p-6 overflow-y-auto">
        <div className="h-full min-h-0 w-full grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 overflow-y-auto">
          {/* LEFT SIDEBAR */}
          <div className="flex flex-col">
          {/* PROFILE */}
            <div className="flex flex-col items-center pb-4 border-b border-gray-200">
              <AdminAvatarUpload
                avatarUrl={avatarUrl}
                fullName={profile.fullName}
                setValue={setValue}
              />
              <h2 className="text-lg font-bold mt-2.5 text-center">{profile.fullName}</h2>
              <p className="text-gray-500 text-xs mt-1 text-center line-clamp-2">{profile.bio || "No bio added"}</p>
              <p className="text-gray-400 text-xs mt-1">Member since 2026</p>
              <button type="button" className="w-full mt-3 bg-blue-600 text-white py-2.5 rounded-full font-medium text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Change Password
              </button>
            </div>
            {/* SOCIAL LINKS */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold border-b pb-3 mb-4">Social Links</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="GitHub"
                  {...register("github")}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
                <input
                  type="text"
                  placeholder="LinkedIn"
                  {...register("linkedin")}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white py-2.5 rounded-full font-medium text-sm hover:bg-blue-700 transition"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
          {/* RIGHT FORM */}
          <div>
            {/* HEADER */}
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-500 mt-0.5 text-xs">Update your personal information</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" value={avatarUrl} {...register("avatarUrl")} />
              {/* BASIC INFO */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-3 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* FULL NAME */}
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      {...register("fullName")}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  {/* EMAIL */}
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  {/* PHONE */}
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      {...register("phone")}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  {/* LOCATION */}
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      {...register("timezone")}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                    {errors.timezone && <p className="text-red-500 text-xs mt-1">{errors.timezone.message}</p>}
                  </div>
                </div>
              </div>
              {/* BIO */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-3 mb-3">Bio</h3>
                <textarea
                  rows="2"
                  {...register("bio")}
                  placeholder="Tell us about yourself..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1.5">{errors.bio.message}</p>}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-3 mb-4">Role & Permissions</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-gray-700">Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      readOnly
                      className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-gray-700">Permissions</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.permissions?.map((permission) => (
                        <span
                          key={permission}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2 border border-gray-300 rounded-lg font-medium text-xs text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium text-xs hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditForm;