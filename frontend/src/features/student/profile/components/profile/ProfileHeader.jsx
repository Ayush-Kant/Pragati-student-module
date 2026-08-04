import { Mail, Phone, Calendar } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import { formatDate } from '../../utils/studentProfileHelpers';

/**
 * A profile header component that displays the student's photo, name,
 * academic details, contact stats, and an optional edit button.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {string} [props.profile.fullName] - Student's full name
 * @param {string} [props.profile.department] - Department name
 * @param {string} [props.profile.course] - Course name
 * @param {number} [props.profile.semester] - Current semester
 * @param {string} [props.profile.email] - Email address
 * @param {string} [props.profile.phone] - Phone number
 * @param {string} [props.profile.joinedAt] - Join date string
 * @param {string} [props.profile.profilePhoto] - Profile photo URL
 * @param {Function} [props.onEdit] - Callback for edit button click
 * @param {boolean} [props.isEditing] - Whether the profile is currently being edited
 * @returns {JSX.Element} The profile header component
 */
const ProfileHeader = ({ profile = {}, onEdit, isEditing }) => {
  if (!profile || Object.keys(profile).length === 0) {
    return null;
  }

  const fullName = profile.fullName || 'Student Name';
  const department = profile.department || 'Department';
  const course = profile.course || 'Course';
  const semester = profile.semester || '';
  const email = profile.email || '';
  const phone = profile.phone || '';
  const joinedAt = profile.joinedAt || '';
  const profilePhoto = profile.profilePhoto || '';

  const semesterText = semester ? `Semester ${semester}` : '';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-100/60 blur-2xl dark:bg-orange-900/40" />
      <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-100/50 blur-2xl dark:bg-emerald-900/30" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <ProfileAvatar
            photoUrl={profilePhoto}
            name={fullName}
            size="lg"
          />

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {fullName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {course} • {department}
            </p>
            {semesterText && (
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                {semesterText}
              </p>
            )}
          </div>
        </div>

        {onEdit && (
          <button
            onClick={onEdit}
            disabled={isEditing}
            className="shrink-0 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-60 dark:shadow-orange-900/30"
          >
            {isEditing ? 'Editing...' : 'Edit Profile'}
          </button>
        )}
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-300">
        {email && (
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-orange-500" />
            {email}
          </span>
        )}
        {phone && (
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-orange-500" />
            {phone}
          </span>
        )}
        {joinedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-orange-500" />
            Joined {formatDate(joinedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
