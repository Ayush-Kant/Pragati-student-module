import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import {
  REQUEST_STATUS,
} from "../../constants/certificateConstants";

/**
 * Display the current state of certificate verification.
 *
 * @param {Object} props
 * @param {string} props.status
 * @param {boolean} props.verified
 * @param {string} props.message
 * @param {"sm"|"md"|"lg"} props.size
 * @param {string} props.className
 * @returns {JSX.Element|null}
 */
const VerificationStatus = ({
  status = REQUEST_STATUS.IDLE,
  verified = false,
  message = "",
  size = "md",
  className = "",
}) => {
  const normalizedStatus = String(status)
    .trim()
    .toLowerCase();

  if (
    normalizedStatus ===
    REQUEST_STATUS.IDLE.toLowerCase()
  ) {
    return null;
  }

  const isLoading =
    normalizedStatus ===
    REQUEST_STATUS.LOADING.toLowerCase();

  const isError =
    normalizedStatus ===
    REQUEST_STATUS.ERROR.toLowerCase();

  const isSuccess =
    normalizedStatus ===
    REQUEST_STATUS.SUCCESS.toLowerCase();

  let config;

  if (isLoading) {
    config = {
      icon: Loader2,
      title: "Verifying certificate",
      description:
        message ||
        "Please wait while we verify the Certificate ID.",
      wrapper:
        "border-slate-200 bg-slate-50 text-slate-700",
      iconWrapper:
        "bg-slate-100 text-slate-600",
      titleColor: "text-slate-800",
      descriptionColor: "text-slate-500",
      animate: true,
    };
  } else if (isError) {
    config = {
      icon: CircleAlert,
      title: "Verification failed",
      description:
        message ||
        "We could not complete certificate verification. Please try again.",
      wrapper:
        "border-red-100 bg-red-50 text-red-700",
      iconWrapper:
        "bg-red-100 text-red-600",
      titleColor: "text-red-800",
      descriptionColor: "text-red-700",
      animate: false,
    };
  } else if (
    isSuccess &&
    verified === true
  ) {
    config = {
      icon: ShieldCheck,
      title: "Certificate verified",
      description:
        message ||
        "This certificate has been successfully verified.",
      wrapper:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
      iconWrapper:
        "bg-emerald-100 text-emerald-600",
      titleColor: "text-emerald-800",
      descriptionColor: "text-emerald-700",
      animate: false,
    };
  } else {
    config = {
      icon: ShieldX,
      title: "Certificate not verified",
      description:
        message ||
        "The Certificate ID could not be verified.",
      wrapper:
        "border-amber-100 bg-amber-50 text-amber-700",
      iconWrapper:
        "bg-amber-100 text-amber-600",
      titleColor: "text-amber-800",
      descriptionColor: "text-amber-700",
      animate: false,
    };
  }

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
      className={`flex w-full items-start rounded-xl border ${selectedSize.container} ${config.wrapper} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={config.title}
    >
      <div
        className={`flex shrink-0 items-center justify-center ${selectedSize.iconWrapper} ${config.iconWrapper}`}
      >
        <Icon
          className={`${selectedSize.icon} ${
            config.animate
              ? "animate-spin"
              : ""
          }`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`font-bold ${selectedSize.title} ${config.titleColor}`}
        >
          {config.title}
        </p>

        <p
          className={`mt-0.5 ${selectedSize.description} ${config.descriptionColor}`}
        >
          {config.description}
        </p>
      </div>

      {isSuccess && verified ? (
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 sm:h-5 sm:w-5"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
};

export default VerificationStatus;