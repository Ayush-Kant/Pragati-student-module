import React from "react";
import PlacementDriveForm from "./PlacementDriveForm";

const EditPlacementDriveForm = ({ isOpen, onClose, onSubmit, driveData }) => {
  return (
    <PlacementDriveForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={driveData}
    />
  );
};

export default EditPlacementDriveForm;
