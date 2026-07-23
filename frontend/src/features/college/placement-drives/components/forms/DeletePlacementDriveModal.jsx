import ConfirmationModal from "../common/ConfirmationModal";

const DeletePlacementDriveModal = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Delete Placement Drive"
      message="Are you sure you want to delete this placement drive? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default DeletePlacementDriveModal;