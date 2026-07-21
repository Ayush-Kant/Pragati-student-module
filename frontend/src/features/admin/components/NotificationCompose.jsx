import { useState } from "react";
import { toast } from "react-hot-toast";

import {
  sendNotification,
  scheduleNotification,
} from "../services/adminService";
import { X } from "lucide-react";

import RecipientSelector from "./RecipientSelector";
import ChannelSelector from "./ChannelSelector";
import SchedulePicker from "./SchedulePicker";
import NotificationTemplateModal from "./NotificationTemplateModal";
import NotificationPreviewModal from "./NotificationPreviewModal";

const NotificationCompose = ({ onClose }) => {
  const [recipients, setRecipients] = useState({
    groups: [],
    specificUser: "",
  });

  const [channels, setChannels] = useState([]);

  const [subject, setSubject] = useState("");

  const [message, setMessage] = useState("");

  const [schedule, setSchedule] = useState({
    type: "now",
    date: "",
  });

  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    if (recipients.groups.length === 0 && !recipients.specificUser.trim()) {
      toast.error("Select at least one recipient");
      return false;
    }

    if (channels.length === 0) {
      toast.error("Select at least one notification channel");
      return false;
    }

    if (!subject.trim()) {
      toast.error("Subject is required");
      return false;
    }

    if (!message.trim()) {
      toast.error("Message is required");
      return false;
    }

    if (schedule.type === "schedule" && !schedule.date) {
      toast.error("Please select a schedule date");
      return false;
    }

    if (schedule.type === "schedule" && new Date(schedule.date) <= new Date()) {
      toast.error("Schedule date must be in the future");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setRecipients({
      groups: [],
      specificUser: "",
    });

    setChannels([]);

    setSubject("");

    setMessage("");

    setSchedule({
      type: "now",
      date: "",
    });

    setPreviewModalOpen(false);
    setTemplateModalOpen(false);
  };

  const handleTemplateSelect = (template) => {
    setSubject(template.subject || "");
    setMessage(template.body || "");

    setTemplateModalOpen(false);
  };

  const handlePreview = () => {
    const isValid = validateForm();

    if (!isValid) return;

    setPreviewModalOpen(true);
  };

  const handleConfirm = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);

      const payload = {
        recipients,
        channels,
        subject,
        message,
      };

      if (schedule.type === "now") {
        await sendNotification(payload);

        toast.success("Notification sent successfully");
      } else {
        await scheduleNotification({
          ...payload,
          scheduledAt: schedule.date,
        });

        toast.success("Notification scheduled successfully");
      }

      setPreviewModalOpen(false);

      resetForm();
    } catch (error) {
      

      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Compose Notification</h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={22} />
            </button>
          </div>

          {/* Recipient Selection */}

          <div className="mb-6">
            <RecipientSelector value={recipients} onChange={setRecipients} />
          </div>

          {/* Channel Selection */}

          <div className="mb-6">
            <ChannelSelector value={channels} onChange={setChannels} />
          </div>

          {/* Subject */}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Subject</label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter notification subject"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* Message */}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Message</label>

            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification..."
              className="w-full rounded border px-3 py-2 resize-none"
            />
          </div>

          {/* Template Button */}

          <div className="mb-6">
            <button
              type="button"
              onClick={() => setTemplateModalOpen(true)}
              className="rounded border px-4 py-2 hover:bg-gray-100"
            >
              Use Template
            </button>
          </div>

          {/* Schedule */}

          <div className="mb-8">
            <SchedulePicker value={schedule} onChange={setSchedule} />
          </div>

          {/* Action Buttons */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="rounded border px-4 py-2"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <NotificationTemplateModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      <NotificationPreviewModal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        onConfirm={handleConfirm}
        notification={{
          recipients,
          channels,
          subject,
          message,
          schedule,
        }}
        submitting={submitting}
      />
    </>
  );
};

export default NotificationCompose;
