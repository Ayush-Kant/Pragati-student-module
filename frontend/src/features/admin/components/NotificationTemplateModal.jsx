import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  getNotificationTemplates,
  createNotificationTemplate,
} from "../services/adminService";

const NotificationTemplateModal = ({ open, onClose, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [templateName, setTemplateName] = useState("");

  const [subject, setSubject] = useState("");

  const [body, setBody] = useState("");

  const resetForm = () => {
    setTemplateName("");
    setSubject("");
    setBody("");
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);

      const response = await getNotificationTemplates();

      setTemplates(response.templates || []);
    } catch (error) {
      

      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  if (!open) return null;

  const handleCreateTemplate = async (e) => {
    e.preventDefault();

    if (!templateName.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }

    if (!body.trim()) {
      toast.error("Body is required");
      return;
    }

    try {
      setSubmitting(true);

      await createNotificationTemplate({
        name: templateName,
        subject,
        body,
      });

      toast.success("Template created successfully");

      resetForm();

      await fetchTemplates();
    } catch (error) {
     

      toast.error("Failed to create template");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = (template) => {
    onSelectTemplate({
      subject: template.subject,
      body: template.body || "",
    });

    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold">Notification Templates</h2>

        {/* Existing Templates */}

        <div className="mb-8">
          <h3 className="mb-3 text-lg font-medium">Existing Templates</h3>

          {loading ? (
            <p className="text-gray-500">Loading templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-gray-500">No templates available.</p>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between rounded border p-4"
                >
                  <div>
                    <p className="font-semibold">{template.name}</p>

                    <p className="text-sm text-gray-500">{template.subject}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect(template)}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Template */}

        <div>
          <h3 className="mb-4 text-lg font-medium">Create Template</h3>

          <form onSubmit={handleCreateTemplate}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Template Name
              </label>

              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Subject</label>

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">Body</label>

              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write notification body..."
                className="w-full rounded border px-3 py-2 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationTemplateModal;
