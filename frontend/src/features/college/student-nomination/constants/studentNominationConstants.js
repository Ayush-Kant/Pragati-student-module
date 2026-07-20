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
      light: "bg-orange-100 text-orange-700 border border-orange-200",
      dark: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    },
    avatar: {
      light: "bg-orange-50 text-orange-600",
      dark: "bg-orange-950/40 text-orange-400",
    },
  },

  // Candidate was rejected by company panel or failed preliminary matching metrics
  Rejected: {
    badge: {
      light: "bg-red-100 text-red-700 border border-red-200",
      dark: "bg-red-500/15 text-red-400 border border-red-500/30",
    },
    avatar: {
      light: "bg-red-50 text-red-600",
      dark: "bg-red-950/40 text-red-400",
    },
  },
  
  // Confirmed job offer selection achieved for corporate drive track
  Selected: {
    badge: {
      light: "bg-teal-100 text-teal-700 border border-teal-200",
      dark: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
    },
    avatar: {
      light: "bg-teal-50 text-teal-600",
      dark: "bg-teal-950/40 text-teal-400",
    },
  }
};