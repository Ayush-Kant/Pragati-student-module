import { Briefcase, Award, File, Languages } from 'lucide-react';

const STATS = [
  {
    key: 'skills',
    label: 'Skills',
    icon: Briefcase,
    getValue: (profile) => Array.isArray(profile?.skills) ? profile.skills.length : 0
  },
  {
    key: 'certifications',
    label: 'Certifications',
    icon: Award,
    getValue: (profile) => Array.isArray(profile?.certifications) ? profile.certifications.length : 0
  },
  {
    key: 'documents',
    label: 'Documents',
    icon: File,
    getValue: (profile) => Array.isArray(profile?.documents) ? profile.documents.length : 0
  },
  {
    key: 'languages',
    label: 'Languages',
    icon: Languages,
    getValue: (profile) => Array.isArray(profile?.languages) ? profile.languages.length : 0
  }
];

/**
 * A profile summary component that displays key profile statistics
 * in a responsive grid with glassmorphism cards.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @returns {JSX.Element} The profile summary component
 */
const ProfileSummary = ({ profile = {} }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        const value = stat.getValue(profile);

        return (
          <div
            key={stat.key}
            className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition-colors hover:bg-white dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileSummary;
