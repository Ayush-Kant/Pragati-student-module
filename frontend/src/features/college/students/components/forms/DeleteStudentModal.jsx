import ConfirmationModal from "../common/ConfirmationModal"

const DeleteStudentModal = ({ student, onConfirm, onCancel, darkMode }) => (
  <ConfirmationModal
    title="Delete Student"
    message={`Are you sure you want to delete ${student?.name} (${student?.enrollmentNo})? This action cannot be undone.`}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmLabel="Delete"
    danger={true}
    darkMode={darkMode}
  />
)

export default DeleteStudentModal