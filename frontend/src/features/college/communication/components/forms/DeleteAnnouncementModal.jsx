import ConfirmationModal from "../../../common/ConfirmationModal";

const DeleteAnnouncementModal = ({
  announcement,
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!announcement) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Delete Announcement"
      message={`Are you sure you want to delete "${announcement.title}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={() => onDelete?.(announcement)}
      onCancel={onClose}
    />
  );
};

export default DeleteAnnouncementModal;