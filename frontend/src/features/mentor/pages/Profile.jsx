import React, { useState } from "react";
import ProfileForm from "../components/profile/ProfileForm";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mentor Profile</h1>

      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Edit"}
      </button>

      {!editMode ? (
        <div>
          <h2>Rahul Sharma</h2>
          <p>MERN Developer</p>
        </div>
      ) : (
        <ProfileForm />
      )}
    </div>
  );
};

export default Profile;