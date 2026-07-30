import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { validateNotification } from "../../validations/communicationValidation";

const NotificationForm = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const { darkMode } = useOutletContext();

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    message: initialData.message || "",
    recipientType: initialData.recipientType || "",
    sendAt: initialData.sendAt || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateNotification(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 rounded-3xl p-6 shadow ${
        darkMode
          ? "bg-[#151D30] text-white"
          : "bg-white text-slate-800"
      }`}
    >
      <div>
        <label className="mb-2 block font-medium">
          Title
        </label>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-500">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Message
        </label>

        <textarea
          rows={5}
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3"
        />

        {errors.message && (
          <p className="mt-1 text-sm text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Recipient Type
        </label>

        <select
          name="recipientType"
          value={formData.recipientType}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3"
        >
          <option value="">Select Recipient</option>
          <option value="students">Students</option>
          <option value="faculty">Faculty</option>
          <option value="placement">Placement Cell</option>
        </select>

        {errors.recipientType && (
          <p className="mt-1 text-sm text-red-500">
            {errors.recipientType}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Send At
        </label>

        <input
          type="datetime-local"
          name="sendAt"
          value={formData.sendAt}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-5 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2 text-white"
        >
          Save Notification
        </button>
      </div>
    </form>
  );
};

export default NotificationForm;