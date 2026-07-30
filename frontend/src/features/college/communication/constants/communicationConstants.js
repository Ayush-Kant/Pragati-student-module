export const ANNOUNCEMENT_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  UNPUBLISHED: "Unpublished",
};

export const ANNOUNCEMENT_CATEGORIES = [
  "Placement",
  "Training",
  "General",
  "Hackathon",
];

export const NOTIFICATION_STATUS = {
  SENT: "Sent",
  SCHEDULED: "Scheduled",
  FAILED: "Failed",
};

export const AUDIENCE_TYPES = [
  "All Students",
  "Department",
  "Course",
  "Batch",
  "Selected Students",
];

export const DATE_FORMAT = "DD/MM/YYYY";

export const statusStyles = {
  Draft: {
    badge: {
      light: "bg-amber-100 text-amber-700 border border-amber-200",
      dark: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    },
    avatar: {
      light: "bg-amber-50 text-amber-600",
      dark: "bg-amber-950/40 text-amber-400",
    },
  },
  Published: {
    badge: {
      light: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      dark: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    },
    avatar: {
      light: "bg-emerald-50 text-emerald-600",
      dark: "bg-emerald-950/40 text-emerald-400",
    },
  },
  Unpublished: {
    badge: {
      light: "bg-slate-100 text-slate-700 border border-slate-200",
      dark: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
    },
    avatar: {
      light: "bg-slate-50 text-slate-600",
      dark: "bg-slate-950/40 text-slate-400",
    },
  },
  Sent: {
    badge: {
      light: "bg-blue-100 text-blue-700 border border-blue-200",
      dark: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    },
    avatar: {
      light: "bg-blue-50 text-blue-600",
      dark: "bg-blue-950/40 text-blue-400",
    },
  },
  Scheduled: {
    badge: {
      light: "bg-purple-100 text-purple-700 border border-purple-200",
      dark: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    },
    avatar: {
      light: "bg-purple-50 text-purple-600",
      dark: "bg-purple-950/40 text-purple-400",
    },
  },
  Pending: {
    badge: {
      light: "bg-orange-100 text-orange-700 border border-orange-200",
      dark: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    },
    avatar: {
      light: "bg-orange-50 text-orange-600",
      dark: "bg-orange-950/40 text-orange-400",
    },
  },
  Failed: {
    badge: {
      light: "bg-red-100 text-red-700 border border-red-200",
      dark: "bg-red-500/15 text-red-400 border border-red-500/30",
    },
    avatar: {
      light: "bg-red-50 text-red-600",
      dark: "bg-red-950/40 text-red-400",
    },
  },
};