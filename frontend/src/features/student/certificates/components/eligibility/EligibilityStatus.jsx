import {
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

import {
  ELIGIBILITY_STATUS,
} from "../../constants/certificateConstants";

/**
 * Display the overall certificate eligibility status.
 *
 * @param {Object} props
 * @param {boolean} props.eligible
 * @param {string} props.status
 * @param {"sm"|"md"|"lg"} props.size
 * @param {boolean} props.showIcon
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const EligibilityStatus = ({
  eligible = false,
  status = "",
  size = "md",
  showIcon = true,
  className = "",
}) => {
  const normalizedStatus = String(status)
    .trim()
    .toLowerCase();

  const isEligible =
    eligible === true ||
    normalizedStatus ===
      ELIGIBILITY_STATUS.ELIGIBLE.toLowerCase();

  const isInProgress =
    normalizedStatus ===
    ELIGIBILITY_STATUS.IN_PROGRESS.toLowerCase();

  const config = isEligible
    ? {
        label: "Eligible",
        description:
          "All required completion criteria have been met.",
        icon: CheckCircle2,
        wrapper:
          "border-emerald-100 bg-emerald-50 text-emerald-700",
        iconWrapper:
          "bg-emerald-100 text-emerald-600",
        title: "text-emerald-800",
        descriptionText: "text-emerald-700",
      }
    : isInProgress
      ? {
          label: "In Progress",
          description:
            "Some certificate requirements are still in progress.",
          icon: CircleAlert,
          wrapper:
            "border-amber-100 bg-amber-50 text-amber-700",
          iconWrapper:
            "bg-amber-100 text-amber-600",
          title: "text-amber-800",
          descriptionText: "text-amber-700",
        }
      : {
          label: "Not Eligible",
          description:
            "Complete the remaining requirements to become eligible.",
          icon: CircleAlert,
          wrapper:
            "border-slate-200 bg-slate-50 text-slate-600",
          iconWrapper:
            "bg-slate-100 text-slate-500",
          title: "text-slate-800",
          descriptionText: "text-slate-600",
        };

  const sizeClasses = {
    sm: {
      container: "gap-2 px-3 py-2.5",
      iconWrapper: "h-8 w-8 rounded-lg",
      icon: "h-4 w-4",
      title: "text-xs",
      description: "text-[10px] leading-4",
    },

    md: {
      container: "gap-3 px-4 py-3.5",
      iconWrapper: "h-9 w-9 rounded-xl",
      icon: "h-4.5 w-4.5",
      title: "text-sm",
      description: "text-xs leading-5",
    },

    lg: {
      container: "gap-3.5 px-5 py-4",
      iconWrapper: "h-10 w-10 rounded-xl",
      icon: "h-5 w-5",
      title: "text-base",
      description: "text-sm leading-5",
    },
  };

  const selectedSize =
    sizeClasses[size] || sizeClasses.md;

  const Icon = config.icon;

  return (
    <div
      className={`flex min-w-0 items-start rounded-xl border ${selectedSize.container} ${config.wrapper} ${className}`}
      role="status"
      aria-label={`Certificate eligibility status: ${config.label}`}
    >
      {showIcon ? (
        <div
          className={`flex shrink-0 items-center justify-center ${selectedSize.iconWrapper} ${config.iconWrapper}`}
        >
          <Icon
            className={selectedSize.icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <p
          className={`font-bold ${selectedSize.title} ${config.title}`}
        >
          {config.label}
        </p>

        <p
          className={`mt-0.5 ${selectedSize.description} ${config.descriptionText}`}
        >
          {config.description}
        </p>
      </div>
    </div>
  );
};

export default EligibilityStatus;