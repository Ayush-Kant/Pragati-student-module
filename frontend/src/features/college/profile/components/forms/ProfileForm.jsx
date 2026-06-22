import React from "react";
import profileDummyData from "../../types/profileDummyData";

const ProfileForm = ({ onEdit }) => {
  const profile = profileDummyData;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-5">
              <img
                src={profile.collegeLogo}
                alt="college"
                className="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
              />

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {profile.collegeName}
                </h1>

                <p className="text-gray-500 mt-1">
                  {profile.tagline}
                </p>

                <span className="inline-flex mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Verified College
                </span>
              </div>
            </div>

            <button
              onClick={onEdit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm">College Code</p>
            <h3 className="font-semibold mt-1">
              {profile.collegeCode}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm">Established</p>
            <h3 className="font-semibold mt-1">
              {profile.establishedYear}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm">College Type</p>
            <h3 className="font-semibold mt-1">
              {profile.collegeType}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-sm">Affiliated To</p>
            <h3 className="font-semibold mt-1">
              {profile.affiliatedTo}
            </h3>
          </div>

        </div>

        {/* College Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-5">
            College Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p>{profile.email}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              <p>{profile.phone}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Website</p>
              <p>{profile.website}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Accreditation</p>
              <p>{profile.accreditation}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm">Address</p>
              <p>{profile.address}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm">About College</p>
              <p>{profile.aboutCollege}</p>
            </div>

          </div>
        </div>

        {/* Contact Person */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-5">
            Contact Person
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p>{profile.contactPerson.name}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Designation</p>
              <p>{profile.contactPerson.designation}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p>{profile.contactPerson.email}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              <p>{profile.contactPerson.phone}</p>
            </div>

          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-5">
            Social Links
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <p>{profile.socialLinks.facebook}</p>
            <p>{profile.socialLinks.linkedin}</p>
            <p>{profile.socialLinks.twitter}</p>
            <p>{profile.socialLinks.instagram}</p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileForm;