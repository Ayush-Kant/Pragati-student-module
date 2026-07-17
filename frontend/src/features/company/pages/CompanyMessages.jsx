import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Mail, Users, Send, CheckSquare, Square, Calendar, Clock, Bell, History } from 'lucide-react';
import api from '../../../services/api';
import "../styles/companyDashboard.css";

const templates = {
  custom: {
    subject: "",
    message: ""
  },
  interview: {
    subject: "Interview Invitation - {company_name}",
    message: "Dear {candidate_name},\n\nWe are pleased to invite you for an interview for the {position} position. Your interview is scheduled for {interview_date}.\n\nPlease let us know if this time works for you.\n\nBest regards,\n{company_name}"
  },
  reminder: {
    subject: "Pending Assessment Reminder - {company_name}",
    message: "Dear {candidate_name},\n\nThis is a reminder to complete your pending assessment for the {position} position. Please complete it before the deadline.\n\nBest regards,\n{company_name}"
  },
  offer: {
    subject: "Job Offer: {position} - {company_name}",
    message: "Dear {candidate_name},\n\nCongratulations! We are thrilled to offer you the position of {position} at {company_name}.\n\nPlease find the detailed offer letter attached. We look forward to having you on board!\n\nBest regards,\n{company_name}"
  },
  rejection: {
    subject: "Application Update - {company_name}",
    message: "Dear {candidate_name},\n\nThank you for your interest in the {position} position at {company_name}. After careful consideration, we regret to inform you that we will not be moving forward with your application.\n\nWe wish you all the best in your future endeavors.\n\nBest regards,\n{company_name}"
  }
};

const previewData = {
  candidate_name: "Rahul Patil",
  interview_date: "May 15, 2026",
  position: "Software Engineer",
  company_name: "Your Company"
};

const CompanyMessages = () => {
  const [recipientGroup, setRecipientGroup] = useState('all');
  const [channels, setChannels] = useState({ email: true, sms: false, inApp: false });
  const [templateKey, setTemplateKey] = useState('custom');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Scheduling and History
  const [isImmediate, setIsImmediate] = useState(true);
  const [scheduleTime, setScheduleTime] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get('/v1/company/notifications');
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Error loading notification history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleTemplateChange = (e) => {
    const key = e.target.value;
    setTemplateKey(key);
    const selected = templates[key];
    if (selected) {
      setSubject(selected.subject);
      setMessage(selected.message);
    }
  };

  const handleToolbarClick = (action) => {
    const textarea = document.getElementById('message-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    switch (action) {
      case 'bold':
        replacement = `**${selectedText || 'text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'text'}*`;
        break;
      case 'underline':
        replacement = `<u>${selectedText || 'text'}</u>`;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link Text'}](url)`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'Item'}`;
        break;
      default:
        return;
    }

    const updatedText = text.substring(0, start) + replacement + text.substring(end);
    setMessage(updatedText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleSend = async () => {
    const activeChannels = Object.keys(channels).filter(k => channels[k]);
    if (activeChannels.length === 0) {
      toast.error("Please select at least one transmission channel (Email, SMS, or In-App).");
      return;
    }

    if (!subject.trim() && channels.email) {
      toast.error("Please enter a subject line for your email.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please compose a message before sending.");
      return;
    }

    if (!isImmediate && !scheduleTime) {
      toast.error("Please select a schedule date and time.");
      return;
    }

    setIsSending(true);

    try {
      if (isImmediate) {
        await api.post('/v1/company/notifications/send', {
          title: subject,
          message,
          recipientGroup,
          channels: activeChannels
        });
        toast.success("Notification sent successfully!");
      } else {
        await api.post('/v1/company/notifications/schedule', {
          title: subject,
          message,
          recipientGroup,
          channels: activeChannels,
          scheduleTime
        });
        toast.success("Notification scheduled successfully!");
      }
      
      // Reset form
      setSubject('');
      setMessage('');
      setTemplateKey('custom');
      setScheduleTime('');
      setIsImmediate(true);
      
      // Refresh history
      fetchHistory();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to submit notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Communication Center</h1>
        <p className="text-sm font-semibold text-slate-400 mt-1">Send notifications and messages to candidates</p>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
        {/* Recipients */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">Recipients</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Users size={18} />
            </span>
            <select
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="block w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="all">All Applied Candidates</option>
              <option value="shortlisted">Shortlisted Candidates</option>
              <option value="interview">Interview Scheduled</option>
              <option value="offer">Offer Selection</option>
              <option value="custom">Custom Selection</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Send Via & Template Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Send Via Checkboxes */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Send Via</label>
            <div className="flex flex-wrap items-center gap-6 mt-1">
              <button
                type="button"
                onClick={() => setChannels(prev => ({ ...prev, email: !prev.email }))}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 focus:outline-none cursor-pointer"
              >
                {channels.email ? (
                  <span className="text-blue-500"><CheckSquare size={20} fill="#eff6ff" /></span>
                ) : (
                  <span className="text-slate-300"><Square size={20} /></span>
                )}
                Email
              </button>

              <button
                type="button"
                onClick={() => setChannels(prev => ({ ...prev, sms: !prev.sms }))}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 focus:outline-none cursor-pointer"
              >
                {channels.sms ? (
                  <span className="text-blue-500"><CheckSquare size={20} fill="#eff6ff" /></span>
                ) : (
                  <span className="text-slate-300"><Square size={20} /></span>
                )}
                SMS
              </button>

              <button
                type="button"
                onClick={() => setChannels(prev => ({ ...prev, inApp: !prev.inApp }))}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 focus:outline-none cursor-pointer"
              >
                {channels.inApp ? (
                  <span className="text-blue-500"><CheckSquare size={20} fill="#eff6ff" /></span>
                ) : (
                  <span className="text-slate-300"><Square size={20} /></span>
                )}
                In-App
              </button>
            </div>
          </div>

          {/* Template Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Template</label>
            <div className="relative">
              <select
                value={templateKey}
                onChange={handleTemplateChange}
                className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="custom">Custom Message</option>
                <option value="interview">Interview Invitation</option>
                <option value="reminder">Assessment Reminder</option>
                <option value="offer">Offer Letter</option>
                <option value="rejection">Rejection Notice</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Line */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">Subject</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail size={16} />
            </span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Message Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">Message</label>
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Editor Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => handleToolbarClick('bold')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => handleToolbarClick('italic')}
                className="text-xs font-bold italic text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => handleToolbarClick('underline')}
                className="text-xs font-bold underline text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
                title="Underline"
              >
                U
              </button>
              <div className="h-4 w-px bg-slate-300" />
              <button
                type="button"
                onClick={() => handleToolbarClick('link')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
                title="Link"
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => handleToolbarClick('list')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
                title="List"
              >
                List
              </button>
            </div>

            {/* Textarea */}
            <textarea
              id="message-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compose your message here...&#10;&#10;You can use the following placeholders:&#10;{candidate_name}, {position}, {interview_date}, {company_name}"
              rows={8}
              className="block w-full p-4 bg-white border-0 text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:ring-0 text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Preview Variables */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview Variables</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <code className="bg-slate-200/60 px-2 py-1 rounded text-slate-600 font-mono text-xs font-medium">&#123;candidate_name&#125;</code>
              <span className="text-slate-400 font-normal">→</span>
              <span>{previewData.candidate_name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <code className="bg-slate-200/60 px-2 py-1 rounded text-slate-600 font-mono text-xs font-medium">&#123;position&#125;</code>
              <span className="text-slate-400 font-normal">→</span>
              <span>{previewData.position}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <code className="bg-slate-200/60 px-2 py-1 rounded text-slate-600 font-mono text-xs font-medium">&#123;interview_date&#125;</code>
              <span className="text-slate-400 font-normal">→</span>
              <span>{previewData.interview_date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <code className="bg-slate-200/60 px-2 py-1 rounded text-slate-600 font-mono text-xs font-medium">&#123;company_name&#125;</code>
              <span className="text-slate-400 font-normal">→</span>
              <span>{previewData.company_name}</span>
            </div>
          </div>
        </div>

        {/* Dispatch Settings (Immediate vs Schedule) */}
        <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
          <label className="block text-sm font-bold text-slate-700">Dispatch Schedule</label>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setIsImmediate(true)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              {isImmediate ? (
                <span className="text-blue-500"><CheckSquare size={20} fill="#eff6ff" /></span>
              ) : (
                <span className="text-slate-300"><Square size={20} /></span>
              )}
              Send Immediately
            </button>

            <button
              type="button"
              onClick={() => setIsImmediate(false)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              {!isImmediate ? (
                <span className="text-blue-500"><CheckSquare size={20} fill="#eff6ff" /></span>
              ) : (
                <span className="text-slate-300"><Square size={20} /></span>
              )}
              Schedule for Later
            </button>
          </div>

          {!isImmediate && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <div className="w-full sm:w-auto relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={15} />
                </span>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="block pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
              </div>
              <p className="text-xs font-medium text-slate-400 flex items-center gap-1 mt-1 sm:mt-0">
                <Clock size={12} />
                Choose the exact date and time the system will auto-dispatch.
              </p>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-500">
            Dispatching to selected candidate segments
          </p>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 bg-[#06b6d4] hover:bg-[#0891b2] active:scale-95 transition-all text-white text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
          >
            {isSending ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : isImmediate ? (
              <Send size={15} />
            ) : (
              <Calendar size={15} />
            )}
            {isSending ? "Processing..." : isImmediate ? "Send Notification" : "Schedule Notification"}
          </button>
        </div>
      </div>

      {/* Notification Log History */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <History className="text-blue-500 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-800">Notification Dispatch History</h2>
        </div>

        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : history.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No dispatch logs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Subject / Message</th>
                  <th className="pb-3">Recipient Group</th>
                  <th className="pb-3">Channels</th>
                  <th className="pb-3 text-center">Recipients</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((log) => (
                  <tr key={log.notificationId} className="text-sm hover:bg-slate-50/50 transition">
                    <td className="py-4 pl-2 pr-4 max-w-xs">
                      <p className="font-semibold text-slate-800 truncate">{log.title}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{log.message}</p>
                    </td>
                    <td className="py-4 font-medium text-slate-600 capitalize">
                      {log.recipientGroup}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {log.channels?.map((ch) => (
                          <span 
                            key={ch} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-center font-semibold text-slate-700">
                      {log.recipientCount}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        log.status === 'sent' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {log.status === 'sent' ? 'Sent' : 'Scheduled'}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-400">
                      {log.status === 'sent' 
                        ? new Date(log.sentAt || log.createdAt).toLocaleString()
                        : new Date(log.scheduledAt).toLocaleString()
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyMessages;