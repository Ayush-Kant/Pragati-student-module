import Modal from "react-modal";

Modal.setAppElement("#root");

const ArchiveProgramModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
}) => {

const handleConfirm = async () => {
    try {
        await onConfirm?.();
        onClose?.();
    } catch (error) {
        console.error(
            "Failed to archive program:",
            error
        );
    }
};

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="
                bg-white
                rounded-2xl
                p-6
                max-w-md
                w-full
                mx-auto
                mt-40
                shadow-xl
                outline-none
            "
            overlayClassName="
                fixed
                inset-0
                bg-black/50
                flex
                justify-center
                items-start
                z-50
            "
        >

            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Archive Training Program
            </h2>

            <p className="text-slate-600 leading-7 mb-8">
                Are you sure you want to archive this training program?
                <br />
                <span className="text-red-500 font-medium">
                    This action can be reversed later.
                </span>
            </p>

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="
                        px-6
                        py-3
                        rounded-xl
                        border
                        border-slate-300
                        hover:bg-slate-100
                        font-medium
                        transition-all
                        duration-300
                    "
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading}
                    className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        shadow-md
                        transition-all
                        duration-300
                    "
                >
                    {loading ? "Archiving..." : "Archive Program"}
                </button>

            </div>

        </Modal>
    );
};

export default ArchiveProgramModal;