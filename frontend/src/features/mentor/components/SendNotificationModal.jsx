import React, { useState } from "react";
import { X, Send, Link, Plus } from "lucide-react";

const AVAILABLE_RECIPIENTS = [
  { id: "stud-1", name: "John Doe", email: "john.doe@example.com" },
  { id: "stud-2", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "stud-3", name: "Riya Sharma", email: "riya.sharma@example.com" },
  { id: "stud-4", name: "Anjali Verma", email: "anjali.verma@example.com" }
];

export default function SendNotificationModal({ isOpen, onClose, onSend }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("info"); // 'info', 'success', 'warning', 'alert'
  const [selectedRecipients, setSelectedRecipients] = useState([
    AVAILABLE_RECIPIENTS[0], // Prepopulate John Doe
    AVAILABLE_RECIPIENTS[1]  // Prepopulate Jane Smith
  ]);
  const [message, setMessage] = useState("");
  const [actionLink, setActionLink] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAddRecipient = (student) => {
    if (selectedRecipients.find((r) => r.id === student.id)) return;
    setSelectedRecipients([...selectedRecipients, student]);
    setDropdownOpen(false);
  };

  const handleRemoveRecipient = (id) => {
    setSelectedRecipients(selectedRecipients.filter((r) => r.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSend({
      title,
      type,
      recipients: selectedRecipients.map((r) => r.name),
      message,
      actionLink: actionLink.trim() || undefined,
      sendAsEmail: sendEmail
    });

    // Reset fields & close
    setTitle("");
    setType("info");
    setSelectedRecipients([AVAILABLE_RECIPIENTS[0], AVAILABLE_RECIPIENTS[1]]);
    setMessage("");
    setActionLink("");
    setSendEmail(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-200 transition-all duration-300 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
              Send Notification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Notification Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Upcoming Assessment Reminder"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            />
          </div>

          {/* Type Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white font-semibold cursor-pointer"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="alert">Alert</option>
            </select>
          </div>

          {/* Recipients Selector */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recipients
            </label>
            <div className="w-full min-h-[46px] p-1.5 border border-slate-200 rounded-lg flex flex-wrap gap-1.5 bg-white items-center">
              {selectedRecipients.map((rec) => (
                <span
                  key={rec.id}
                  className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200/50"
                >
                  <span>{rec.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient(rec.id)}
                    className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors ml-1 cursor-pointer border border-blue-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add recipient...</span>
              </button>
            </div>

            {/* Dropdown search list */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 overflow-hidden divide-y divide-slate-100">
                {AVAILABLE_RECIPIENTS.filter(
                  (st) => !selectedRecipients.find((r) => r.id === st.id)
                ).map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleAddRecipient(student)}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-700 flex items-center justify-between"
                  >
                    <span>{student.name}</span>
                    <span className="text-slate-400 font-medium">{student.email}</span>
                  </div>
                ))}
                {AVAILABLE_RECIPIENTS.filter(
                  (st) => !selectedRecipients.find((r) => r.id === st.id)
                ).length === 0 && (
                  <div className="px-4 py-3 text-xs font-medium text-slate-400 text-center">
                    All students selected
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          {/* Action Link URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Action Link URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={actionLink}
                onChange={(e) => setActionLink(e.target.value)}
                placeholder="https://"
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
              />
              <Link className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Also Send as Email Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span className="text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors">
              Also send as Email
            </span>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 bg-slate-50/10 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-extrabold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-all shadow-sm cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
