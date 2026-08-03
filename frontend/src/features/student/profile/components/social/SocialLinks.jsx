import { useState } from 'react';
import { User, Code2, Globe, MessageCircle, ExternalLink } from 'lucide-react';

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateSocialLinks = (links) => {
  const errors = {};
  if (links.linkedIn && !isValidUrl(links.linkedIn)) {
    errors.linkedIn = 'Please enter a valid LinkedIn URL';
  }
  if (links.github && !isValidUrl(links.github)) {
    errors.github = 'Please enter a valid GitHub URL';
  }
  if (links.portfolio && !isValidUrl(links.portfolio)) {
    errors.portfolio = 'Please enter a valid portfolio URL';
  }
  if (links.twitter && !isValidUrl(links.twitter)) {
    errors.twitter = 'Please enter a valid Twitter URL';
  }
  return errors;
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const FieldDisplay = ({ label, value, href, icon: Icon }) => {
  if (!value) return null;
  return (
    <a
      href={href || value}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-gray-700/50 bg-white/5 px-4 py-3 shadow-sm transition-colors hover:border-orange-500/30"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-medium text-white truncate">{value}</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-gray-500 shrink-0" />
    </a>
  );
};

const FieldInput = ({ label, name, value, onChange, error, placeholder, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
      <Icon className="h-4 w-4 text-orange-500" />
      {label}
    </label>
    <input
      type="url"
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
        error ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
      }`}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

const SocialLinks = ({ socialLinks = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const [form, setForm] = useState({
    linkedIn: socialLinks.linkedIn || '',
    github: socialLinks.github || '',
    portfolio: socialLinks.portfolio || '',
    twitter: socialLinks.twitter || ''
  });
  const [localErrors, setLocalErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (localErrors[name]) {
      setLocalErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateSocialLinks(form);
    setLocalErrors(errors);
    if (Object.keys(errors).length === 0 && onUpdate) {
      onUpdate({ socialLinks: form });
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  if (!isEditing) {
    const hasAnyLink = socialLinks.linkedIn || socialLinks.github || socialLinks.portfolio || socialLinks.twitter;
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
        <SectionHeader title="Social Profiles" subtitle="Your online presence and professional networks" />
        {!hasAnyLink ? (
          <p className="text-sm text-gray-500 italic">No social links added yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldDisplay label="LinkedIn" value={socialLinks.linkedIn} href={socialLinks.linkedIn} icon={User} />
            <FieldDisplay label="GitHub" value={socialLinks.github} href={socialLinks.github} icon={Code2} />
            <FieldDisplay label="Portfolio" value={socialLinks.portfolio} href={socialLinks.portfolio} icon={Globe} />
            <FieldDisplay label="Twitter" value={socialLinks.twitter} href={socialLinks.twitter} icon={MessageCircle} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="Social Profiles" subtitle="Update your online presence and professional networks" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput label="LinkedIn" name="linkedIn" value={form.linkedIn} onChange={handleChange} error={errors.linkedIn} placeholder="https://linkedin.com/in/username" icon={User} />
          <FieldInput label="GitHub" name="github" value={form.github} onChange={handleChange} error={errors.github} placeholder="https://github.com/username" icon={Code2} />
          <FieldInput label="Portfolio" name="portfolio" value={form.portfolio} onChange={handleChange} error={errors.portfolio} placeholder="https://yourportfolio.com" icon={Globe} />
          <FieldInput label="Twitter" name="twitter" value={form.twitter} onChange={handleChange} error={errors.twitter} placeholder="https://twitter.com/username" icon={MessageCircle} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => onUpdate && onUpdate(null)} className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-gray-700 rounded-xl hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#050505]">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialLinks;
