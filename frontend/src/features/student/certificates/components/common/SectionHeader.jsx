/**
 * Reusable section heading for certificate pages and cards.
 *
 * @param {Object} props
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {string} props.description
 * @param {React.ReactNode} props.action
 * @param {"left"|"center"} props.align
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const SectionHeader = ({
  eyebrow = "",
  title,
  description = "",
  action = null,
  align = "left",
  className = "",
}) => {
  const alignmentClasses =
    align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <div
      className={`flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between ${className}`}
    >
      <div
        className={`flex min-w-0 flex-1 flex-col ${alignmentClasses}`}
      >
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[11px]">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="shrink-0 self-start md:self-end">
          {action}
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeader;