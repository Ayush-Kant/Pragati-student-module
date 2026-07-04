const AdminProfileCard = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* HERO SECTION */}
      <div className="h-28 rounded-[30px] bg-gradient-to-r from-slate-950 via-violet-700 to-blue-600 shadow-xl flex items-center px-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Admin Profile
          </h1>

          <p className="text-blue-100 mt-1">
            Manage your account information and settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* MAIN PROFILE CARD */}
        <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-6">
              {/* AVATAR */}
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-5xl font-bold text-white shadow-2xl ring-4 ring-blue-100">
                {profile.fullName?.charAt(0) || "S"}
              </div>

              <div>
                <h2 className="text-4xl font-bold text-slate-900">
                  {profile.fullName}
                </h2>

                <p className="mt-2 text-slate-500">
                  Profile last updated recently
                </p>
              </div>
            </div>

            {/* STATUS */}
            <div className="rounded-3xl bg-green-50 border border-green-200 p-5 min-w-[200px]">
              <p className="font-semibold text-slate-800">
                Profile Status
              </p>

              <div className="mt-3 flex items-center gap-2 text-green-600 font-semibold">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                Active
              </div>
            </div>
          </div>

          {/* INFO CARDS */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Email
              </p>

              <p className="mt-4 font-semibold text-slate-900 break-all">
                {profile.email}
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-cyan-50 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Phone
              </p>

              <p className="mt-4 font-semibold text-slate-900">
                {profile.contactInfo?.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-purple-50 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Location
              </p>

              <p className="mt-4 font-semibold text-slate-900">
                {profile.contactInfo?.timezone || "Not provided"}
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Member Since
              </p>

              <p className="mt-4 font-semibold text-slate-900">
                2026
              </p>
            </div>
          </div>

          {/* ABOUT */}
          <div className="mt-8 rounded-[32px] bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">
              About
            </h3>

            <p className="mt-5 leading-8 text-slate-600">
              {profile.bio || "No bio added"}
            </p>
          </div>

          {/* ROLE & PERMISSIONS */}
          <div className="mt-8 rounded-[32px] bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">
              Role & Permissions
            </h3>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Role
              </p>

              <input
                type="text"
                value={profile.role}
                readOnly
                className="mt-3 w-full rounded-2xl bg-slate-100 px-5 py-4 text-slate-700 outline-none"
              />
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Permissions
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {profile.permissions?.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full bg-blue-100 text-blue-700 px-4 py-2 font-medium"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE SUMMARY */}
        <div className="rounded-[32px] bg-gradient-to-br from-slate-50 to-blue-50 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-slate-900">
              Profile Summary
            </h3>

            <span className="rounded-full bg-white px-4 py-2 text-xs text-slate-600 shadow-sm">
              Quick View
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Full Name
              </p>

              <p className="mt-3 font-semibold text-slate-900">
                {profile.fullName}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Email
              </p>

              <p className="mt-3 font-semibold text-slate-900 break-all">
                {profile.email}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Phone
              </p>

              <p className="mt-3 font-semibold text-slate-900">
                {profile.contactInfo?.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Location
              </p>

              <p className="mt-3 font-semibold text-slate-900">
                {profile.contactInfo?.timezone || "Not provided"}
              </p>
            </div>

            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-3xl bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  GitHub
                </p>

                <p className="mt-3 truncate text-blue-600 font-medium">
                  {profile.socialLinks.github}
                </p>
              </a>
            )}

            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-3xl bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  LinkedIn
                </p>

                <p className="mt-3 truncate text-blue-600 font-medium">
                  {profile.socialLinks.linkedin}
                </p>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileCard;