import { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";

export default function RejectModal({ isOpen, onClose, onConfirm, company, }) {
  const [reason, setReason] = useState("");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-white p-6 rounded-lg w-[400px] mx-auto mt-40 outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
    >
      <h2 className="text-xl font-bold mb-4">
        Reject Company
      </h2>

      <p className="mb-6">
        Are you sure you want to reject{" "}
        <span className="font-semibold">
          {company?.name}
        </span>
        ?
      </p>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Enter rejection reason"
        className="w-full border rounded p-3 h-28 mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (reason.trim().length < 5) {
              toast.error(
                "Reason must contain at least 5 characters"
              );
              return;
            }
            onConfirm(reason);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Reject
        </button>
      </div>
    </Modal>
  );
}