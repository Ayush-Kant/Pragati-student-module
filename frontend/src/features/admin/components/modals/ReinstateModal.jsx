import Modal from "react-modal";

export default function ReinstateModal({
    isOpen,
    onClose,
    onConfirm,
    company,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            className="bg-white p-6 rounded-lg w-[400px] mx-auto mt-40 outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
        >
            <h2 className="text-xl font-bold mb-4">
                Reinstate Company
            </h2>

            <p className="mb-6">
                Are you sure you want to reinstate{" "}
                <span className="font-semibold">
                    {company?.name}
                </span>
                ?
            </p>

            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border rounded"
                >
                    Cancel
                </button>

                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Reinstate
                </button>
            </div>
        </Modal>
    );
}