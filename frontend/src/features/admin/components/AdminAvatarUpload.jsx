import { useRef, useState } from "react";

const AdminAvatarUpload = ({ avatarUrl, fullName, setValue }) => {
  const fileInputRef = useRef(null);
  const [hasImageError, setHasImageError] = useState(false);
  const [preview, setPreview] = useState(avatarUrl || null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setHasImageError(false);
    if (setValue) {
      setValue("avatarUrl", url, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const initial = fullName?.trim()?.charAt(0)?.toUpperCase() || "A";
  const showImage = (preview || avatarUrl) && !hasImageError;

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="flex items-center gap-5 border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer"
    >
      {/* Circle Avatar Wrapper */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
          {showImage ? (
            <img
              src={preview || avatarUrl}
              alt="avatar"
              onError={() => setHasImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-extrabold text-slate-400 select-none">
              {initial}
            </span>
          )}
        </div>

        {/* Camera overlay button */}
        <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-md">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>

      {/* Upload Instructions Labels */}
      <div>
        <div className="text-sm font-bold text-slate-800">Profile Photo</div>
        <div className="text-[10px] text-slate-400 mt-0.5">JPG, GIF or PNG. Max size 2MB.</div>
        <span className="text-xs font-bold text-blue-600 hover:text-blue-800 transition block mt-1.5">
          Upload New Picture
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AdminAvatarUpload;
