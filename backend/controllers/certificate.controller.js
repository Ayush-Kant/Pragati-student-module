let template = {
  id: 1,
  brandColors: {
    primary: "#2563eb",
    secondary: "#1e293b",
  },
  organizationLogo: "",
  mentorSignature: "",
};

export const getTemplate = (req, res) => {
  res.json(template);
};

export const saveTemplate = (req, res) => {
  template = { ...template, ...req.body };
  res.status(201).json(template);
};

export const updateTemplate = (req, res) => {
  template = { ...template, ...req.body };
  res.json(template);
};