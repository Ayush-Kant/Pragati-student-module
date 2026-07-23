import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { verifyStudent, blockStudent, unblockStudent, resetStudentPassword } from "../services/adminService";

Modal.setAppElement("#root");

const StudentActionButtons = ({ student }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [actionType, setActionType] = useState("");
    const [reason, setReason] = useState("");

    const handleVerify = async () => {
        const confirmVerify =
            window.confirm( `Are you sure you want to verify ${student.name}?` );
        if (!confirmVerify)
            return; 
        try {
            await verifyStudent(student.id);
            toast.success( "Student verified successfully" );
        } catch (error) {
            toast.error( "Failed to verify student" );
        }
    };

    const openModal = (type) => {
        setActionType(type);
        setReason("");
        setIsOpen(true);
    }

    const handleBlock = async () => {
        const confirmBlock =
            window.confirm( `Are you sure you want to block ${student.name}?` );

        if (!confirmBlock)
            return;
        try {
            await blockStudent(student.id);
            toast.success( "Student blocked successfully" );
        } catch (error) {
            toast.error( "Failed to block student" );
        }
    };

    const handleUnblock = async () => {
        const confirmUnblock =
            window.confirm( `Are you sure you want to unblock ${student.name}?` );
        if (!confirmUnblock)
            return;
        try {
            await unblockStudent(student.id);
            toast.success( "Student unblocked successfully" );
        } catch (error) {
            toast.error( "Failed to unblock student" );
        }
    };

    const handleResetPassword = async () => {
        const confirmReset =
            window.confirm( `Are you sure you want to reset the password for ${student.name}?` );
        if (!confirmReset)
            return;
        try {
            await resetStudentPassword(student.id);
            toast.success( "Password reset successfully" );
        } catch (error) {
            toast.error( "Failed to reset password" );
        }
    };

  return (
    <div className="flex gap-2">
      {student.status === "Pending" && (
        <>
          <button             className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition cursor-pointer" onClick={handleVerify}>
            Verify
          </button>

          <button className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer" onClick={handleBlock}>
            Block
          </button>
        </>
      )}

      {student.status === "Verified" && (
        <button className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer" onClick={handleBlock}   >
          Block
        </button>
      )}

      {student.status === "Blocked" && (
        <button className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition cursor-pointer" onClick={handleUnblock}>
          Unblock
        </button>
      )}

      <button className="px-3 py-1 rounded-full bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 transition cursor-pointer" onClick={handleResetPassword}>
        Reset Password
      </button>
    </div>
  );
};

export default StudentActionButtons;