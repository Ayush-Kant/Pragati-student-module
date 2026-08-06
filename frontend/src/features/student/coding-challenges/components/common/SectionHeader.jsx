/**
 * Section header with optional subtitle.
 *
 * @param {{ title: string, subtitle?: string, action?: JSX.Element }} props
 */
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div>
      <h2 className="text-xl font-bold text-gray-100">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default SectionHeader;
