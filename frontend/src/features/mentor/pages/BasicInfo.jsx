import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import OnboardingLayout from "../components/layout/OnboardingLayout";

const BasicInfo = () => {

  const navigate = useNavigate();

  const [profileImage, setProfileImage] =
    useState(
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    );

  const [saved, setSaved] =
    useState(false);

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (file) {

      const imageUrl =
        URL.createObjectURL(file);

      setProfileImage(imageUrl);
    }
  };

  const handleSaveDraft = () => {

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (

    <OnboardingLayout
      step={1}
      title=""
      subtitle=""
    >

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">

          {/* TOP PURPLE LINE */}
          <div className="w-28 h-2 bg-gradient-to-r from-pink-500 to-blue-600 rounded-full mb-8"></div>

          {/* TITLE */}
          <h1 className="text-[48px] font-bold text-gray-900">
            Basic Information
          </h1>

          <p className="text-gray-600 mt-5 text-lg">
            Help us build your professional profile.
          </p>

          <p className="text-gray-600 mt-2 text-lg">
            These details will be visible to potential mentees.
          </p>

          {/* PROFILE PHOTO BOX */}
          <div className="mt-10 border-2 border-dashed border-blue-200 rounded-[28px] p-8 flex items-center gap-8">

            {/* AVATAR */}
            <div className="relative">

              <img
                src={profileImage}
                alt="avatar"
                className="w-32 h-32 rounded-full bg-gray-100 object-cover"
              />

              <label className="absolute bottom-0 right-0 bg-blue-600 text-white w-12 h-12 rounded-full text-xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition">

                📷

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

              </label>

            </div>

            {/* TEXT */}
            <div>

              <h2 className="text-3xl font-semibold text-gray-900">
                Profile Photo
              </h2>

              <p className="text-gray-400 mt-3 text-lg">
                JPG, GIF or PNG. Max size 2MB.
              </p>

              <label className="mt-5 inline-block text-blue-600 font-semibold text-xl cursor-pointer hover:text-blue-800">

                Upload New Picture

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

              </label>

            </div>

          </div>

          {/* INPUTS */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">

            {/* FULL NAME */}
            <div>

              <label className="block mb-3 text-xl font-semibold text-gray-900">
                Full Name
              </label>

              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* DISPLAY TITLE */}
            <div>

              <label className="block mb-3 text-xl font-semibold text-gray-900">
                Display Title
              </label>

              <input
                type="text"
                placeholder="e.g. Senior Software Architect"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* EMAIL */}
          <div className="mt-8">

            <label className="block mb-3 text-xl font-semibold text-gray-900">
              Email Address
            </label>

            <div className="relative">

              <input
                type="email"
                placeholder="alex@company.com"
                className="w-full border border-gray-300 rounded-2xl px-14 py-4 text-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <span className="absolute left-5 top-4 text-2xl text-gray-400">
                ✉️
              </span>

            </div>

          </div>

          {/* BIO */}
          <div className="mt-8">

            <label className="block mb-3 text-xl font-semibold text-gray-900">
              Professional Bio
            </label>

            <textarea
              rows="5"
              placeholder="Briefly describe your mentorship style and professional background..."
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-between mt-10">

            <button
              onClick={handleSaveDraft}
              className="text-blue-600 text-xl font-semibold hover:text-blue-800 transition"
            >
              {saved
                ? "Draft Saved ✓"
                : "Save Draft"}
            </button>

            <button
              onClick={() =>
                navigate(
                  "/mentor/onboarding/professional-profile"
                )
              }
              className="bg-gradient-to-r from-purple-700 to-blue-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition"
              
            >
              Continue to Profile →
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* JOIN THE BRIDGE CARD */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 p-8 relative overflow-hidden min-h-[420px]">

            {/* TOP ICON */}
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-3xl">
              💡
            </div>

            <h2 className="text-[34px] font-bold mt-6 text-gray-900">
              Join the Bridge
            </h2>

            <p className="text-gray-600 mt-5 leading-10 text-xl max-w-[260px]">
              “Sharing your journey isn’t just about technical advice;
              it’s about building the confidence of the next generation of talent.”
            </p>

            {/* BACKGROUND CIRCLES */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full opacity-50"></div>

            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-100 rounded-full opacity-50"></div>

            {/* OWL IMAGE */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
              alt="owl"
              className="w-40 absolute bottom-6 right-6"
            />

          </div>

          {/* CHECKLIST CARD */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 p-8">

            <h2 className="text-3xl font-bold text-gray-900">
              Application Checklist
            </h2>

            <div className="mt-8 space-y-6">

              {/* ACTIVE */}
              <div className="flex items-center gap-4">

                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>

                <p className="text-purple-600 text-xl font-medium">
                  Basic Identity
                </p>

              </div>

              {/* OTHERS */}
              {[
                "Expertise & Socials",
                "Experience Links",
                "Office Hours",
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4 hover:translate-x-1 transition"
                >

                  <div className="w-8 h-8 rounded-full border-2 border-gray-400"></div>

                  <p className="text-gray-500 text-xl">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* SUPPORT */}
          <div className="flex items-center gap-3 text-gray-500 text-lg">

            <span>🎧</span>

            <p>
              Need help?
              <span className="text-blue-600 font-medium ml-1 cursor-pointer hover:text-blue-800">
                Contact Support
              </span>
            </p>

          </div>

        </div>

      </div>

    </OnboardingLayout>

  );
};

export default BasicInfo;