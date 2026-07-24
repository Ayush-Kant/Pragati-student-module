import api from "../../../../services/api";

/**
 * Normalizes backend database drive object to frontend structure
 */
const normalizeDrive = (drive) => {
  if (!drive) return null;

  // Format dates safely for date inputs (YYYY-MM-DD)
  const rawDriveDate = drive.drive_date || drive.driveDate || "";
  const rawDeadline = drive.deadline || "";

  const driveDate = rawDriveDate ? String(rawDriveDate).split("T")[0] : "";
  const deadline = rawDeadline ? String(rawDeadline).split("T")[0] : "";

  // Normalize eligibility
  const dept = Array.isArray(drive.allowed_branches)
    ? drive.allowed_branches
    : drive.eligibility?.department || [];

  const cgpaVal = drive.cgpa_cutoff !== undefined && drive.cgpa_cutoff !== null
    ? Number(drive.cgpa_cutoff)
    : (drive.eligibility?.cgpa !== undefined ? Number(drive.eligibility.cgpa) : 6.0);

  // Normalize rounds
  const rawRounds = Array.isArray(drive.rounds) ? drive.rounds : [];
  const rounds = rawRounds.map((r, index) => ({
    id: r.id || index + 1,
    name: r.round_name || r.name || `Round ${index + 1}`,
    round_name: r.round_name || r.name || `Round ${index + 1}`,
    description: r.description || "",
    order: r.round_order || r.order || index + 1,
    round_order: r.round_order || r.order || index + 1,
  }));

  return {
    id: drive.id,
    company: drive.company || "",
    role: drive.role || "",
    package: drive.package || "",
    driveDate,
    drive_date: driveDate,
    deadline,
    status: drive.status || "Upcoming",
    location: drive.location || "Bangalore",
    hiringProcess: drive.hiring_process || drive.hiringProcess || "",
    eligibility: {
      department: dept,
      course: drive.eligibility?.course || ["B.Tech", "M.Tech"],
      batch: drive.eligibility?.batch || ["2026"],
      cgpa: cgpaVal,
      skills: drive.eligibility?.skills || "",
    },
    rounds,
    totalApplied: Number(drive.total_applied || 0),
    totalSelected: Number(drive.total_selected || 0),
  };
};

/**
 * Normalizes frontend payload to backend database structure
 */
const toBackendPayload = (drive) => {
  const driveDate = drive.driveDate || drive.drive_date;
  return {
    company: drive.company,
    role: drive.role,
    package: drive.package,
    drive_date: driveDate,
    deadline: drive.deadline,
    status: drive.status || "Upcoming",
    location: drive.location,
    hiring_process: drive.hiringProcess || drive.hiring_process,
    eligibility: drive.eligibility,
    rounds: drive.rounds,
  };
};

/**
 * Fetch all placement drives from backend database
 */
export const getPlacementDrives = async () => {
  const res = await api.get("/placement-drives");
  const rawData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
  return {
    success: true,
    data: rawData.map(normalizeDrive),
  };
};

/**
 * Fetch a single placement drive by ID
 */
export const getPlacementDriveById = async (id) => {
  const res = await api.get(`/placement-drives/${id}`);
  const drive = res.data?.data || res.data;
  return {
    success: !!drive,
    data: normalizeDrive(drive),
  };
};

/**
 * Create a placement drive in database
 */
export const createPlacementDrive = async (drive) => {
  const payload = toBackendPayload(drive);
  const res = await api.post("/placement-drives", payload);
  const newDrive = res.data?.data || res.data;
  return {
    success: true,
    data: normalizeDrive(newDrive),
  };
};

/**
 * Update a placement drive in database
 */
export const updatePlacementDrive = async (id, updatedDrive) => {
  const payload = toBackendPayload(updatedDrive);
  const res = await api.put(`/placement-drives/${id}`, payload);
  const drive = res.data?.data || res.data;
  return {
    success: true,
    data: normalizeDrive(drive),
  };
};

/**
 * Delete a placement drive from database
 */
export const deletePlacementDrive = async (id) => {
  await api.delete(`/placement-drives/${id}`);
  return {
    success: true,
    message: `Placement drive ${id} deleted successfully.`,
  };
};