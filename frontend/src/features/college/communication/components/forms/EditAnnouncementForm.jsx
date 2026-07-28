import React from "react";
import AnnouncementForm from "./AnnouncementForm";

const EditAnnouncementForm = ({ announcement, onUpdate, onCancel }) => {
  return (
    <AnnouncementForm
      initialData={announcement}
      onSubmit={onUpdate}
      onCancel={onCancel}
      isEditing={true}
    />
  );
};

export default EditAnnouncementForm;