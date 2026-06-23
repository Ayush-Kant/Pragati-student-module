// ProfilePage.jsx
import { useState } from "react";

import ProfileEditForm from "../../components/profile/ProfileEditForm";
import ProjectCard from "../../components/profile/ProjectCard";
import ValidationAlert from "../../components/profile/ValidationAlert";

import { profileDummyData } from "../../../college/profile/types/profileDummyData";
import { validateSocialLinks } from "../../../college/profile/components/validation/profileValidation";

const SKILL_ICONS = {
  React: { bg: "bg-blue-50", icon: "⚛️" },
  "Node.js": { bg: "bg-green-50", icon: "🟢" },
  Python: { bg: "bg-yellow-50", icon: "🐍" },
  SQL: { bg: "bg-gray-100", icon: "🗄️" },
  Git: { bg: "bg-red-50", icon: "🔀" },
  default: { bg: "bg-gray-50", icon: "💡" },
};


const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
      {label}
    </span>

    <span className="text-sm font-semibold text-gray-800">
      {value || (
        <span className="text-gray-300 italic font-normal">
          Not provided
        </span>
      )}
    </span>
  </div>
);


const ProfilePage = () => {

  const [profile, setProfile] = useState(profileDummyData);

  const [isEditing, setIsEditing] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [validationError, setValidationError] = useState(null);


  const handleSave = (updatedData) => {

    const validation = validateSocialLinks(updatedData);

    if (!validation.isValid) {

      setValidationError(validation.message);

      return;
    }


    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));


    setIsEditing(false);

    setShowSuccess(true);


    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

  };


  const initials = profile?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0,2)
    .toUpperCase();



  return (

    <div className="min-h-screen bg-gray-50 font-sans">

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">


        {validationError && (

          <ValidationAlert
            message={validationError}
            onClose={() => setValidationError(null)}
          />

        )}



        {showSuccess && (

          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">

            Profile updated successfully!

          </div>

        )}




        <div className="flex justify-between mb-6">


          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              My Profile
            </h1>


            <p className="text-sm text-gray-400">

              {isEditing
                ? "Update your details below"
                : "View and manage your profile"}

            </p>

          </div>



          {!isEditing && (

            <button

              onClick={() => setIsEditing(true)}

              className="px-5 py-2 bg-white border rounded-xl"

            >

              Edit Profile

            </button>

          )}


        </div>




        <div className="bg-white rounded-2xl border p-6 mb-5">


          <div className="flex items-center gap-5">


            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-xl font-bold">

              {initials}

            </div>



            <div>


              <h2 className="text-xl font-bold">

                {profile.name}

              </h2>


              <p className="text-sm text-gray-500">

                {profile.department}

              </p>


            </div>


          </div>


        </div>




        {!isEditing && (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">



            <div className="lg:col-span-2 bg-white rounded-2xl border p-6">


              <h3 className="font-bold mb-5">

                Personal Information

              </h3>



              <div className="grid sm:grid-cols-2 gap-5">


                <InfoField
                  label="Email"
                  value={profile.email}
                />


                <InfoField
                  label="Phone"
                  value={profile.phone}
                />


                <InfoField
                  label="City"
                  value={profile.city}
                />


                <InfoField
                  label="Department"
                  value={profile.department}
                />

              </div>


            </div>





            <div className="bg-white rounded-2xl border p-6">


              <h3 className="font-bold mb-5">

                Skills

              </h3>


              <div className="grid gap-3">


                {profile.skills?.map((skill)=>(


                  <div

                    key={skill}

                    className={`p-3 rounded-xl ${

                      SKILL_ICONS[skill]?.bg ||

                      SKILL_ICONS.default.bg

                    }`}

                  >

                    {SKILL_ICONS[skill]?.icon ||
                    SKILL_ICONS.default.icon}

                    {" "}

                    {skill}


                  </div>


                ))}


              </div>


            </div>






            <div className="lg:col-span-3 bg-white rounded-2xl border p-6">


              <h3 className="font-bold mb-5">

                Projects

              </h3>



              <div className="grid md:grid-cols-2 gap-4">


                {profile.projects?.map((project)=>(


                  <ProjectCard

                    key={project.id}

                    project={project}

                    onEdit={() => {}}

                    onDelete={() => {}}

                  />


                ))}


              </div>


            </div>



          </div>


        )}





        {isEditing && (

          <div className="bg-white rounded-2xl border p-6">


            <ProfileEditForm

              profile={profile}

              onSave={handleSave}

              onCancel={() => setIsEditing(false)}

            />


          </div>

        )}



      </div>


    </div>

  );

};



export default ProfilePage;