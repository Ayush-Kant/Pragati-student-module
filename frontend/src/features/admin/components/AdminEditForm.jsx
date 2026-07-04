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
  <div className="min-h-screen bg-[#f4f7fb] p-6">
    <div className="w-full bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

      {/* Top Banner */}
      <div className="h-32 bg-gradient-to-r from-[#050816] via-[#6d28d9] to-[#2563eb]" />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 p-8 -mt-16 relative z-10">

        {/* LEFT PROFILE PANEL */}
        <div className="bg-white rounded-[28px] p-6 shadow-lg border border-slate-100">

          <div className="flex flex-col items-center text-center">

            <AdminAvatarUpload
              avatarUrl={avatarUrl}
              fullName={profile.fullName}
              setValue={setValue}
            />

            <h2 className="mt-5 text-3xl font-bold text-slate-900">
              {profile.fullName}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {profile.bio || "No bio added"}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Member since 2026
            </p>

            <button
              type="button"
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all"
            >
              Change Password
            </button>
          </div>

          {/* Social Links */}
          <div className="mt-8">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Social Links
            </h3>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="GitHub Profile URL"
                {...register("github")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="LinkedIn Profile URL"
                {...register("linkedin")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all"

              >
                Add Link
              </button>

            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white rounded-[28px] p-8 shadow-lg border border-slate-100">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900">
              Edit Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Update your personal information and account details
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >

            <input
              type="hidden"
              value={avatarUrl}
              {...register("avatarUrl")}
            />

            {/* Basic Information */}
            <div>

              <h3 className="mb-6 text-xl font-bold text-slate-900">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors.fullName && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    {...register("phone")}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors.phone && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location
                  </label>

                  <input
                    type="text"
                    {...register("timezone")}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors.timezone && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.timezone.message}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Bio */}
            <div>

              <h3 className="mb-6 text-xl font-bold text-slate-900">
                About You
              </h3>

              <textarea
                rows="4"
                {...register("bio")}
                placeholder="Tell us something about yourself..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.bio && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Role & Permissions */}
            <div>

              <h3 className="mb-6 text-xl font-bold text-slate-900">
                Role & Permissions
              </h3>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <input
                  type="text"
                  value={profile.role}
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div className="mt-6">

                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Permissions
                </label>

                <div className="flex flex-wrap gap-3">

                  {profile.permissions?.map((permission) => (
                    <span
                      key={permission}
                      className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                    >
                      {permission}
                    </span>
                  ))}

                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">

              <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all"
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