export const validateDisputeId = (req, res, next) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({
      error: "Valid dispute id is required.",
    });
  }

  next();
};

export const validateResolveDispute = (req, res, next) => {
  const { resolution } = req.body;

  if (!resolution || !resolution.trim()) {
    return res.status(400).json({
      error: "resolution is required.",
    });
  }

  next();
};

export const validateEscalateDispute = (req, res, next) => {
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({
      error: "reason is required.",
    });
  }

  next();
};

export const validateAddDisputeNote = (req, res, next) => {
  const { note } = req.body;

  if (!note || !note.trim()) {
    return res.status(400).json({
      error: "note is required.",
    });
  }

  next();
};