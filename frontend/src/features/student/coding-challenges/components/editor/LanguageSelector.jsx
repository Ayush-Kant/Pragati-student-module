import { memo } from 'react';
import { SUPPORTED_LANGUAGES } from '../../constants/codingChallengeConstants';

const LanguageSelector = memo(({ language, onChange, disabled = false }) => (
  <div className="flex items-center gap-2">
    <label htmlFor="language-selector" className="sr-only">Programming language</label>
    <select
      id="language-selector"
      value={language}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs px-3 py-1.5 rounded-lg bg-[#141414] border border-gray-700 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500/40 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all duration-200 cursor-pointer"
    >
      {SUPPORTED_LANGUAGES.map((lang) => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
    </select>
  </div>
));

LanguageSelector.displayName = 'LanguageSelector';
export default LanguageSelector;
