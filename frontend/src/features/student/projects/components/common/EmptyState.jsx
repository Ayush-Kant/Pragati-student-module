import { FolderOpen } from 'lucide-react';

/**
 * Reusable empty state component.
 * @param {{ title: string, description: string, icon?: string, actionButton?: JSX.Element }} props
 */
const EmptyState = ({ title, description, icon, actionButton }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="mb-5">
      {icon ? (
        <span role="img" aria-label={title} className="text-5xl">{icon}</span>
      ) : (
        <div className="p-4 rounded-full bg-gradient-to-br from-violet-500/15 to-transparent inline-block">
          <FolderOpen className="w-14 h-14 text-violet-400 mx-auto" aria-hidden="true" />
        </div>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-400 max-w-lg mb-6">{description}</p>
    {actionButton && <div>{actionButton}</div>}
  </div>
);

export default EmptyState;
