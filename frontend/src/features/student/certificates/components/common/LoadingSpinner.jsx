import { Loader2 } from "lucide-react";

/**
 * Reusable certificate-module loading indicator.
 *
 * @param {Object} props
 * @param {"sm"|"md"|"lg"} props.size
 * @param {string} props.label
 * @param {boolean} props.fullScreen
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({
  size = "md",
  label = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: {
      spinner: "h-4 w-4",
      text: "text-xs",
    },
    md: {
      spinner: "h-5 w-5",
      text: "text-sm",
    },
    lg: {
      spinner: "h-7 w-7",
      text: "text-sm",
    },
  };

  const selectedSize =
    sizeClasses[size] || sizeClasses.md;

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Loader2
        className={`${selectedSize.spinner} animate-spin text-slate-700`}
        aria-hidden="true"
      />

      {label ? (
        <p
          className={`${selectedSize.text} font-medium text-slate-500`}
        >
          {label}
        </p>
      ) : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[320px] w-full items-center justify-center px-4 py-10 sm:min-h-[380px] md:min-h-[420px] lg:min-h-[460px]">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;