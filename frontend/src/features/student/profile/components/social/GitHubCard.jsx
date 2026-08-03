import { useState } from 'react';
import { Code2, ExternalLink } from 'lucide-react';

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
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const Code2Card = ({ githubUrl = '', isEditing = false, onUpdate }) => {
  const [url, setUrl] = useState(githubUrl);
  const [error, setError] = useState('');

  const handleBlur = () => {
    const trimmed = url.trim();
    if (trimmed && !isValidUrl(trimmed)) {
      setError('Please enter a valid Code2 URL');
    } else {
      setError('');
    }
  };

  const handleSave = () => {
    const trimmed = url.trim();
    if (trimmed && !isValidUrl(trimmed)) {
      setError('Please enter a valid Code2 URL');
      return;
    }
    setError('');
    onUpdate && onUpdate(trimmed);
  };

  if (!isEditing) {
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
        <SectionHeader title="Code2 Profile" subtitle="Your code repository and contributions" />
        {githubUrl ? (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-gray-700/50 bg-white/5 px-4 py-3 transition-colors hover:border-gray-600">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#181717] text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Code2</p>
              <p className="text-sm font-medium text-white truncate">{githubUrl}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 shrink-0" />
          </a>
        ) : (
          <p className="text-sm text-gray-500 italic">No Code2 profile linked</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="Code2 Profile" subtitle="Update your code repository profile" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-gray-300" />
            Code2 URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            onBlur={handleBlur}
            placeholder="https://github.com/username"
            className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
              error ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
            }`}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => onUpdate && onUpdate(githubUrl)} className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-gray-700 rounded-xl hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="px-6 py-2.5 text-sm font-semibold text-white bg-[#181717] rounded-lg hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-[#181717] focus:ring-offset-2 focus:ring-offset-[#050505]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Code2Card;
