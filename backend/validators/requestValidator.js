export const validatePlacementDrive = (req, res, next) => {
  const { company, role, package: pkg, drive_date, deadline, status } = req.body;

  if (!company || typeof company !== "string" || company.trim().length === 0) {
    return res.status(400).json({
      error: "Valid company name is required",
    });
  }

  if (!role || typeof role !== "string" || role.trim().length === 0) {
    return res.status(400).json({
      error: "Valid role is required",
    });
  }

  if (drive_date && isNaN(Date.parse(drive_date))) {
    return res.status(400).json({
      error: "Valid drive date is required",
    });
  }

  if (deadline && isNaN(Date.parse(deadline))) {
    return res.status(400).json({
      error: "Valid deadline date is required",
    });
  }

  if (drive_date && deadline && new Date(deadline) > new Date(drive_date)) {
    return res.status(400).json({
      error: "Deadline cannot be after drive date",
    });
  }

  const validStatuses = ["Upcoming", "Open", "Closed", "Completed"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Status must be one of: " + validStatuses.join(", "),
    });
  }

  req.body.company = company.trim();
  req.body.role = role.trim();

  next();
};

// =====================================================
// Eligibility Validator
// =====================================================

export const validateEligibility = (req, res, next) => {
  const {
    minimum_cgpa,
    allowed_backlogs,
    eligible_departments,
  } = req.body;

  if (
    minimum_cgpa === undefined ||
    isNaN(parseFloat(minimum_cgpa)) ||
    minimum_cgpa < 0 ||
    minimum_cgpa > 10
  ) {
    return res.status(400).json({
      error: "Minimum CGPA must be between 0 and 10",
    });
  }

  if (
    allowed_backlogs !== undefined &&
    (isNaN(parseInt(allowed_backlogs)) || allowed_backlogs < 0)
  ) {
    return res.status(400).json({
      error: "Allowed backlogs must be zero or greater",
    });
  }

  if (
    !eligible_departments ||
    typeof eligible_departments !== "string"
  ) {
    return res.status(400).json({
      error: "Eligible departments are required",
    });
  }

  next();
};

// =====================================================
// Interview Round Validator
// =====================================================

export const validateInterviewRound = (req, res, next) => {
  const {
    round_name,
    description,
    round_order,
  } = req.body;

  if (
    !round_name ||
    typeof round_name !== "string" ||
    round_name.trim().length === 0
  ) {
    return res.status(400).json({
      error: "Valid round name is required",
    });
  }

  if (
    !description ||
    typeof description !== "string"
  ) {
    return res.status(400).json({
      error: "Description is required",
    });
  }

  if (
    round_order === undefined ||
    isNaN(parseInt(round_order))
  ) {
    return res.status(400).json({
      error: "Round order must be a number",
    });
  }

  req.body.round_name = round_name.trim();
  req.body.description = description.trim();

  next();
};

// =====================================================
// Schedule Validator
// =====================================================

export const validateSchedule = (req, res, next) => {
  const {
    event_name,
    event_date,
    event_time,
    venue,
  } = req.body;

  if (
    !event_name ||
    typeof event_name !== "string"
  ) {
    return res.status(400).json({
      error: "Valid event name is required",
    });
  }

  if (
    !event_date ||
    isNaN(Date.parse(event_date))
  ) {
    return res.status(400).json({
      error: "Valid event date is required",
    });
  }

  if (!event_time) {
    return res.status(400).json({
      error: "Valid event time is required",
    });
  }

  if (
    !venue ||
    typeof venue !== "string"
  ) {
    return res.status(400).json({
      error: "Valid venue is required",
    });
  }

  req.body.event_name = event_name.trim();
  req.body.venue = venue.trim();

  next();
};