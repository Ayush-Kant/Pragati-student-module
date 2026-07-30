import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, UserCheck, X } from "lucide-react";

const StudentSelector = ({ selectedStudents = [], onAddStudent, onRemoveStudent }) => {
  const context = useOutletContext();
  const darkMode = context?.darkMode ?? false;

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    if (onAddStudent) {
      onAddStudent({
        recipient_name: nameInput.trim(),
        recipient_email: emailInput.trim(),
      });
    }

    setNameInput("");
    setEmailInput("");
  };

  return (
    <div className="w-full space-y-4">
      <label className={`block text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
        Target Students
      </label>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        <input
          type="text"
          placeholder="Student Name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className={`sm:col-span-2 px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
            darkMode
              ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
          }`}
        />
        <input
          type="email"
          placeholder="Student Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className={`sm:col-span-2 px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
            darkMode
              ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
          }`}
        />
        <button
          type="submit"
          disabled={!nameInput.trim() || !emailInput.trim()}
          className="sm:col-span-1 px-3 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {selectedStudents.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedStudents.map((student, idx) => (
            <span
              key={student.id || idx}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                darkMode
                  ? "border-slate-700 bg-slate-800/80 text-slate-200"
                  : "border-slate-200 bg-slate-100 text-slate-800"
              }`}
            >
              <UserCheck size={13} className="text-blue-500" />
              <span>{student.recipient_name || student.name}</span>
              <span className="opacity-60 text-[10px]">({student.recipient_email || student.email})</span>
              {onRemoveStudent && (
                <button
                  type="button"
                  onClick={() => onRemoveStudent(student.id || idx)}
                  className="hover:text-red-500 transition-colors p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSelector;
