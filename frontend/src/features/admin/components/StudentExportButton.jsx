import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import { exportStudents } from "../services/adminService";

Modal.setAppElement("#root");

const StudentExportButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [actionType, setActionType] = useState("");

    const handleExport = async () => {
        try {
            await exportStudents();
        } catch (error) {
            console.error("Failed to export students", error);
            toast.error("Failed to export students");
        }
    };

    return (
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleExport}>
            Export CSV
        </button>
    );
};

export default StudentExportButton;