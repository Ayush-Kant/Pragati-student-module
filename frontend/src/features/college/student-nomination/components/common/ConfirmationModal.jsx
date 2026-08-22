import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

/**
 * Mappings for color variations based on the action type.
 */
const variants = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    confirmBtn: "bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    confirmBtn: "bg-amber-500 hover:bg-amber-600 text-white shadow-lg cursor-pointer",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg cursor-pointer",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer",
  },
};

const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const context = useOutletContext ? useOutletContext() : {};
  const darkMode = context?.darkMode ?? false;

  if (!isOpen) return null;

  const current = variants[variant] || variants.danger;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl transition-all duration-300 ${
          darkMode ? "border-[#3D3D3D] bg-[#2D2D2D] text-white" : "border-slate-200 bg-white text-slate-800"
        }`}
      >
        {/* Header Section */}
        <div
          className={`flex items-center justify-between border-b px-6 py-5 ${
            darkMode ? "border-[#3D3D3D]" : "border-slate-200"
          }`}
        >
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onCancel}
            className={`rounded-lg p-2 transition cursor-pointer ${
              darkMode ? "hover:bg-[#1A1A1A] text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Info Panel */}
        <div className="flex flex-col items-center px-8 py-8 text-center">
          <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${current.iconBg}`}>
            <Icon className={current.iconColor} size={36} />
          </div>
          <p className={`text-base leading-7 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            {message}
          </p>
        </div>

        {/* Action Button Controls Footer */}
        <div
          className={`flex justify-end gap-3 border-t px-6 py-5 ${
            darkMode ? "border-[#3D3D3D]" : "border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={`rounded-xl px-5 py-2.5 font-medium transition cursor-pointer ${
              darkMode ? "bg-[#1A1A1A] text-gray-300 hover:bg-[#3D3D3D] border border-[#3D3D3D]" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2.5 font-medium transition ${
              loading ? "cursor-not-allowed bg-slate-400 opacity-60" : current.confirmBtn
            }`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;