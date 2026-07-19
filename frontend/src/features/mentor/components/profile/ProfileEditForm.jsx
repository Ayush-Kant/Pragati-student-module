import AvatarUpload from "./AvatarUpload";
import React, { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters"),

  expertiseTags: z
    .string()
    .min(1, "At least one skill required"),

  avatarUrl: z
    .string()
    .url("Enter valid image URL"),
});

const ProfileEditForm = ({
  profile,
  onCancel,
  onSave,
}) => {

const [preview, setPreview] =
  useState(profile.avatarUrl);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      fullName: profile.fullName,

      bio: profile.bio,

      expertiseTags:
        profile.expertiseTags.join(", "),

      avatarUrl: profile.avatarUrl,
    },
  });

  const submitHandler = (data) => {
    const updatedData = {
      ...profile,

      fullName: data.fullName,

      bio: data.bio,

      avatarUrl: preview,

      expertiseTags:
        data.expertiseTags.split(","),
    };

    onSave(updatedData);

    toast.success(
      "Profile Updated Successfully"
    );
  };

  return (
    <form
      onSubmit={handleSubmit(
        submitHandler
      )}
      className="bg-white rounded-3xl shadow-2xl p-10 max-w-6xl mx-auto"
    >

      {/* TITLE */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold">
          Edit Profile
        </h2>

        <p className="text-gray-500 mt-2">
          Update your mentor details
        </p>
      </div>

      {/* AVATAR */}
     
<div className="mb-10">

  <AvatarUpload
    preview={preview}
    setPreview={setPreview}
  />

</div>


      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* FULL NAME */}
        <div>
          <label className="font-semibold">
            Full Name
          </label>

         <input
            {...register("fullName")}
            className="w-full mt-2 border rounded-xl p-3"
          />

          <p className="text-red-500 text-sm mt-1">
            {errors.fullName?.message}
          </p> 
        </div>

        {/* TAGS */}
        <div>
          <label className="font-semibold">
            Expertise Tags
          </label>

          <input
            {...register("expertiseTags")}
            className="w-full mt-2 border rounded-xl p-3"
          />

          <p className="text-red-500 text-sm mt-1">
            {
              errors.expertiseTags
                ?.message
            }
          </p>
        </div>

      </div>

      {/* BIO */}
      <div className="mt-6">
        <label className="font-semibold">
          Professional Bio
        </label>

        <textarea
          rows={5}
          {...register("bio")}
          className="w-full mt-2 border rounded-xl p-3"
        />

        <p className="text-red-500 text-sm mt-1">
          {errors.bio?.message}
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-8">

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border px-8 py-3 rounded-2xl"
        >
          Cancel
        </button>

      </div>

    </form>
  );
};

export default ProfileEditForm;