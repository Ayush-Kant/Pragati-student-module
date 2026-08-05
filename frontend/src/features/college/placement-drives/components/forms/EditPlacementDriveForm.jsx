import React from "react";
import PlacementDriveForm from "./PlacementDriveForm";

const EditPlacementDriveForm = ({ isOpen, onClose, onSubmit, driveData, darkMode }) => {
  return (
    <PlacementDriveForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={driveData}
      darkMode={darkMode}
    />
  );
};

export default EditPlacementDriveForm;
