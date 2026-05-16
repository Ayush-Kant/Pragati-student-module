const AdminProfileCard = ({ profile }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-900 text-3xl font-semibold text-white shadow-lg">
              {profile.fullName?.charAt(0) || "S"}
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">{profile.fullName}</h2>
              <p className="text-sm text-slate-500 mt-1">Profile last updated recently</p>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-400 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Profile Status</div>
            <div className="mt-3 flex items-center gap-2 text-green-600">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              Active
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
            <p className="mt-3 text-sm font-medium text-slate-900">{profile.email}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</p>
            <p className="mt-3 text-sm font-medium text-slate-900">{profile.contactInfo?.phone || "Not provided"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Location</p>
            <p className="mt-3 text-sm font-medium text-slate-900">{profile.contactInfo?.timezone || "Not provided"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Member since</p>
            <p className="mt-3 text-sm font-medium text-slate-900">2026</p>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-gray-400 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">About</h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {profile.bio || "No bio added"}
          </p>
        </div>
        <div className="mt-8 rounded-[32px] border border-gray-400 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900">Role & Permissions</h3>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Role
            </p>

            <input
              type="text"
              value={profile.role}
              readOnly
              className="mt-2 w-full rounded-2xl border border-gray-400 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            />
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Permissions
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {profile.permissions?.map((permission) => (
                <span
                  key={permission}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Profile Summary</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Quick view</span>
        </div>
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-gray-400 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Full Name</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{profile.fullName}</p>
          </div>
          <div className="rounded-3xl border border-gray-400 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{profile.email}</p>
          </div>
          <div className="rounded-3xl border border-gray-400 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{profile.contactInfo?.phone || "Not provided"}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Location</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{profile.contactInfo?.timezone || "Not provided"}</p>
          </div>
          {profile.socialLinks?.github && (
            <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="block">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">GitHub</p>
              <p className="mt-1 text-sm font-medium text-blue-600 truncate hover:underline">{profile.socialLinks.github}</p>
            </a>
          )}
          {profile.socialLinks?.linkedin && (
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="block">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">LinkedIn</p>
              <p className="mt-1 text-sm font-medium text-blue-600 truncate hover:underline">{profile.socialLinks.linkedin}</p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileCard;