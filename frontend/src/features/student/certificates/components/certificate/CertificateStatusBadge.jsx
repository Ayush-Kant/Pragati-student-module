import {
  CheckCircle2,
  Clock3,
  XCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import {
  CERTIFICATE_STATUS,
  VERIFICATION_STATUS,
} from "../../constants/certificateConstants";

/**
 * Display a certificate status or verification status.
 *
 * @param {Object} props
 * @param {string} props.status
 * @param {"certificate"|"verification"} props.type
 * @param {"sm"|"md"} props.size
 * @param {boolean} props.showIcon
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const CertificateStatusBadge = ({
  status = "",
  type = "certificate",
  size = "sm",
  showIcon = true,
  className = "",
}) => {
  const normalizedStatus = String(status)
    .trim()
    .toLowerCase();

  const certificateConfig = {
    [CERTIFICATE_STATUS.ISSUED.toLowerCase()]: {
      label: "Issued",
      icon: CheckCircle2,
      classes:
        "border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    },

    [CERTIFICATE_STATUS.PENDING.toLowerCase()]: {
      label: "Pending",
      icon: Clock3,
      classes:
        "border-amber-100 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    },

    [CERTIFICATE_STATUS.REVOKED.toLowerCase()]: {
      label: "Revoked",
      icon: XCircle,
      classes:
        "border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300",
    },
  };

  const verificationConfig = {
    [VERIFICATION_STATUS.VERIFIED.toLowerCase()]: {
      label: "Verified",
      icon: ShieldCheck,
      classes:
        "border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    },

    [VERIFICATION_STATUS.UNVERIFIED.toLowerCase()]: {
      label: "Unverified",
      icon: ShieldAlert,
      classes:
        "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400",
    },

    [VERIFICATION_STATUS.INVALID.toLowerCase()]: {
      label: "Invalid",
      icon: ShieldAlert,
      classes:
        "border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300",
    },
  };

  const config =
    type === "verification"
      ? verificationConfig[normalizedStatus]
      : certificateConfig[normalizedStatus];

  const fallbackLabel =
    type === "verification"
      ? "Unknown"
      : "Unknown";

  const Icon =
    config?.icon ||
    (type === "verification"
      ? ShieldAlert
      : Clock3);

  const label =
    config?.label || fallbackLabel;

  const sizeClasses = {
    sm: {
      wrapper:
        "px-2.5 py-1 text-[10px] rounded-lg",
      icon: "h-3.5 w-3.5",
    },

    md: {
      wrapper:
        "px-3 py-1.5 text-xs rounded-lg",
      icon: "h-4 w-4",
    },
  };

  const selectedSize =
    sizeClasses[size] || sizeClasses.sm;

  const colorClasses =
    config?.classes ||
    "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 border font-semibold leading-none ${selectedSize.wrapper} ${colorClasses} ${className}`}
      aria-label={label}
    >
      {showIcon ? (
        <Icon
          className={`${selectedSize.icon} shrink-0`}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      ) : null}

      <span className="truncate">
        {label}
      </span>
    </span>
  );
};

export default CertificateStatusBadge;