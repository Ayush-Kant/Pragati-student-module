import { useState } from "react";

const AdminAvatarUpload = ({
  avatarUrl,
  fullName,
  setValue,
}) => {

  const [hasImageError, setHasImageError] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setValue("avatarUrl", imageUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setHasImageError(false);
  };

  const handleImageError = () => {
    setHasImageError(true);
  };

  const initial = fullName?.trim()?.charAt(0)?.toUpperCase() || "S";
  const showImage = avatarUrl && !hasImageError;
  return (
    <div className="flex flex-col items-center">
      <label className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-4 border-blue-300 bg-slate-900 text-3xl font-semibold text-white transition hover:opacity-90">
        {showImage ? (
          <img
            src={avatarUrl}
            alt=""
            onError={handleImageError}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default AdminAvatarUpload;