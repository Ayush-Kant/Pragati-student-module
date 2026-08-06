export const uploadLogo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No logo uploaded",
    });
  }

  res.json({
    success: true,
    url: `/uploads/logos/${req.file.filename}`,
  });
};

export const uploadSignature = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No signature uploaded",
    });
  }

  res.json({
    success: true,
    url: `/uploads/signatures/${req.file.filename}`,
  });
};