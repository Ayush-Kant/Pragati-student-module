import { useState } from 'react';
import { Globe, ExternalLink } from 'lucide-react';

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
  </div>
);

/**
 * A component for displaying and editing portfolio website link.
 * Supports view and edit modes.
 * @param {Object} props - The component props
 * @param {string} [props.portfolioUrl=''] - The portfolio website URL
 * @param {boolean} [props.isEditing=false] - Whether the component is in edit mode
 * @param {Function} [props.onUpdate] - Callback when portfolio URL is updated
 * @returns {JSX.Element} The portfolio card component
 */
const PortfolioCard = ({ portfolioUrl = '', isEditing = false, onUpdate }) => {
  const [url, setUrl] = useState(portfolioUrl);
  const [error, setError] = useState('');

  const handleBlur = () => {
    const trimmed = url.trim();
    if (trimmed && !isValidUrl(trimmed)) {
      setError('Please enter a valid portfolio URL');
    } else {
      setError('');
    }
  };

  const handleSave = () => {
    const trimmed = url.trim();
    if (trimmed && !isValidUrl(trimmed)) {
      setError('Please enter a valid portfolio URL');
      return;
    }
    setError('');
    onUpdate && onUpdate(trimmed);
  };

  if (!isEditing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
        <SectionHeader
          title="Portfolio Website"
          subtitle="Your personal portfolio or project showcase"
        />
        {portfolioUrl ? (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl border border-orange-200/60 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 shadow-sm transition-colors hover:border-orange-300 hover:shadow-md dark:border-orange-900/40 dark:from-orange-900/20 dark:to-amber-900/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
              <Globe className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest dark:text-orange-400">Portfolio</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{portfolioUrl}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-orange-500 shrink-0" />
          </a>
        ) : (
          <p className="text-sm text-gray-400 italic">No portfolio website linked</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="Portfolio Website"
        subtitle="Update your personal portfolio or project showcase"
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Globe className="h-4 w-4 text-orange-500" />
            Portfolio URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            onBlur={handleBlur}
            placeholder="https://yourportfolio.com"
            className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 dark:text-white ${
              error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-500'
            }`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onUpdate && onUpdate(portfolioUrl)}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
