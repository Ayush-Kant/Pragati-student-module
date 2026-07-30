import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

const variants = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    confirmBtn: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
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
  const context = useOutletContext();
  const darkMode = context?.darkMode ?? false;

  if (!isOpen) return null;

  const current = variants[variant] || variants.danger;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl transition-all duration-300 ${
          darkMode ? "border-slate-700 bg-[#151D30]" : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b px-6 py-5 ${
            darkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onCancel}
            className={`rounded-lg p-2 transition ${
              darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center px-8 py-8 text-center">
          <div
            className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${current.iconBg}`}
          >
            <Icon className={current.iconColor} size={36} />
          </div>
          <p
            className={`text-base leading-7 ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {message}
          </p>
        </div>

        <div
          className={`flex justify-end gap-3 border-t px-6 py-5 ${
            darkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <button
            onClick={onCancel}
            disabled={loading}
            className={`rounded-xl px-5 py-2.5 font-medium transition ${
              darkMode
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2.5 font-medium transition ${current.confirmBtn}`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
