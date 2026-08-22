export const statusStyles = {
  // Candidate meets standard eligibility rules (CGPA, department, backlogs)
  Eligible: {
    badge: {
      light: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      dark: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    },
    avatar: {
      light: "bg-emerald-50 text-emerald-600",
      dark: "bg-emerald-950/40 text-emerald-400",
    },
  },

  // Coordinator submitted student to drive; awaiting company evaluation review
  Nominated: {
    badge: {
      light: "bg-blue-100 text-blue-700 border border-blue-200",
      dark: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    },
    avatar: {
      light: "bg-blue-50 text-blue-600",
      dark: "bg-blue-950/40 text-blue-400",
    },
  },

  // College / Drive admin approved the student nomination
  Approved: {
    badge: {
      light: "bg-indigo-100 text-indigo-700 border border-indigo-200",
      dark: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
    },
    avatar: {
      light: "bg-indigo-50 text-indigo-600",
      dark: "bg-indigo-950/40 text-indigo-400",
    },
  },

  // Student successfully passed resume/test filtering and advanced to interviews
  Shortlisted: {
    badge: {
      light: "bg-violet-100 text-violet-700 border border-violet-200",
      dark: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
    },
    avatar: {
      light: "bg-violet-50 text-violet-600",
      dark: "bg-violet-950/40 text-violet-400",
    },
  },

  // Intermediate state for student evaluation verification queues
  Waiting: {
    badge: {
      light: "bg-amber-100 text-amber-700 border border-amber-200",
      dark: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    },
    avatar: {
      light: "bg-amber-50 text-amber-600",
      dark: "bg-amber-950/40 text-amber-400",
    },
  },

  // Candidate was rejected by company panel or failed preliminary matching metrics
  Rejected: {
    badge: {
      light: "bg-rose-100 text-rose-700 border border-rose-200",
      dark: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    },
    avatar: {
      light: "bg-rose-50 text-rose-600",
      dark: "bg-rose-950/40 text-rose-400",
    },
  },

  // Confirmed job offer selection 
  Selected: {
    badge: {
      light: "bg-teal-100 text-teal-700 border border-teal-200",
      dark: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
    },
    avatar: {
      light: "bg-teal-50 text-teal-600",
      dark: "bg-teal-950/40 text-teal-400",
    },
  },

  // Default fallback for unknown, inactive, or unmapped statuses
  Default: {
    badge: {
      light: "bg-slate-100 text-slate-700 border border-slate-200",
      dark: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
    },
    avatar: {
      light: "bg-slate-50 text-slate-600",
      dark: "bg-slate-950/40 text-slate-400",
    },
  },
};

export const getStatusStyles = (status) => {
  if (status === null || status === undefined) return statusStyles.Default;

  const normalized = String(status).trim().toLowerCase();

  switch (normalized) {
    case "eligible":
      return statusStyles.Eligible;
    case "nominated":
    case "already_nominated":
      return statusStyles.Nominated;
    case "approved":
    case "accept":
    case "accepted":
      return statusStyles.Approved;
    case "shortlisted":
      return statusStyles.Shortlisted;
    case "waiting":
    case "waitlisted":
    case "pending":
    case "in_review":
    case "in review":
      return statusStyles.Waiting;
    case "rejected":
    case "reject":
    case "withdrawn":
      return statusStyles.Rejected;
    case "selected":
    case "placed":
    case "hired":
      return statusStyles.Selected;
    default:
      return statusStyles.Default;
  }
};