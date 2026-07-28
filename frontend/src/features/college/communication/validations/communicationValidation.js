/* =====================================
      ANNOUNCEMENT VALIDATION
===================================== */

const TITLE_REGEX =
  /^[A-Za-z0-9][A-Za-z0-9&.,'()\-:!?/" ]{2,149}$/;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateAnnouncement = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = "Title is required.";
  } else if (!TITLE_REGEX.test(formData.title.trim())) {
    errors.title =
      "Title must be 3-150 characters and start with a letter.";
  }

 if (!formData.description?.trim()) {
    errors.description = "Description is required.";
}

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/* =====================================
      NOTIFICATION VALIDATION
===================================== */

export const validateNotification = (formData) => {
  const errors = {};

  if (!formData.announcement_id) {
    errors.announcement_id = "Announcement is required.";
  }

  if (!formData.title?.trim()) {
    errors.title = "Title is required.";
  } else if (!TITLE_REGEX.test(formData.title.trim())) {
    errors.title = "Invalid notification title.";
  }

  if (!formData.message?.trim()) {
    errors.message = "Message is required.";
  }

  if (!formData.audience?.trim()) {
    errors.audience = "Audience is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/* =====================================
      RECIPIENT VALIDATION
===================================== */

export const validateRecipient = (formData) => {
  const errors = {};

  if (!formData.recipient_name?.trim()) {
    errors.recipient_name =
      "Recipient name is required.";
  }

  if (!formData.recipient_email?.trim()) {
    errors.recipient_email =
      "Recipient email is required.";
  } else if (
    !EMAIL_REGEX.test(
      formData.recipient_email.trim()
    )
  ) {
    errors.recipient_email =
      "Invalid email address.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};