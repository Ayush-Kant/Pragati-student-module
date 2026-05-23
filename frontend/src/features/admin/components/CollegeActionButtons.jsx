import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";


export default function CollegeActionButtons({ status, collegeName = "College" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    const confirmApprove =
      window.confirm(
        `Are you sure you want to approve ${collegeName}?`
      );
    if (!confirmApprove) return;
    toast.success(
      "College approved successfully"
    );
  };

  const openModal = (type) => {
    setActionType(type);
    setReason("");
    setIsOpen(true);
  };

  return (
    <div className="flex items-center gap-2">

      {/* Pending */}
      {status === "pending" && (
        <>
          <button
            onClick={handleApprove}
            className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition cursor-pointer"
          >
            Approve
          </button>

          <button
            onClick={() => openModal("reject")}
            className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer"
          >
            Reject
          </button>
        </>
      )}

      {/* Approved */}
      {status === "approved" && (
        <button
          onClick={() => openModal("suspend")}
          className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition cursor-pointer"
        >
          Suspend
        </button>
      )}

      {/* Suspended */}
      {status === "suspended" && (
        <button
          onClick={handleApprove}
          className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition cursor-pointer"
        >
          Approve
        </button>
      )}

      {/* Rejected */}
      {status === "rejected" && (
        <button
          onClick={handleApprove}
          className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
        >
          Approve
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="bg-white p-6 rounded-lg w-[400px] mx-auto mt-40 outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
      >
        <h2 className="text-xl font-bold mb-4">
          {
            actionType === "reject"
              ?
              "Reject College"
              :
              "Suspend College"
          }
        </h2>
        <textarea
          value={reason}
          onChange={(e) =>
            setReason(
              e.target.value
            )
          }
          placeholder="Enter reason"
          className="w-full border rounded p-3 h-28 mb-3"
        />
        <button
          onClick={() => {
            if (reason.trim().length < 5) {
              toast.error(
                "Reason must contain minimum 5 characters"
              );
              return;
            }
            toast.success(
              `${actionType} successful`
            );
            setIsOpen(false);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Confirm
        </button>
      </Modal>
    </div>
  );
}