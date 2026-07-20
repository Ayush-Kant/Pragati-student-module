import React from "react";

const AvatarUpload = ({
  preview,
  setPreview,
}) => {
  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  return (
    <div className="flex flex-col items-center">

      <img
        src={preview}
        alt="avatar"
        className="w-40 h-40 rounded-full border-[6px] border-purple-500 object-cover shadow-lg"
      />

      <label className="mt-5 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-2xl cursor-pointer shadow-lg hover:scale-105 transition">

        Upload Photo

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={
            handleImageChange
          }
        />

      </label>
    </div>
  );
};

export default AvatarUpload;